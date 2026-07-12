import { Murid, Attendance, Assessment } from "../types";

export interface SyncResult {
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  error?: string;
}

const SPREADSHEET_NAME = "UKAIL - Database & Asesmen Guru";

/**
 * Searches for an existing UKAIL Spreadsheet in Google Drive.
 */
async function findExistingSpreadsheet(accessToken: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`name = '${SPREADSHEET_NAME}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gagal mencari spreadsheet di Drive:", errText);
      return null;
    }

    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error finding spreadsheet:", error);
    return null;
  }
}

/**
 * Creates a new Google Spreadsheet with default worksheets for UKAIL.
 */
async function createNewSpreadsheet(accessToken: string): Promise<string> {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_NAME
      },
      sheets: [
        { properties: { title: "Murid" } },
        { properties: { title: "Kehadiran" } },
        { properties: { title: "Asesmen" } }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gagal membuat spreadsheet baru: ${errText}`);
  }

  const data = await response.json();
  if (!data.spreadsheetId) {
    throw new Error("Gagal menerima ID Spreadsheet yang baru dibuat.");
  }
  return data.spreadsheetId;
}

/**
 * Syncs students, attendance, and assessments to the Google Sheet.
 */
export async function syncDataToGoogleSheets(
  accessToken: string,
  students: Murid[],
  attendance: Attendance[],
  assessments: Assessment[]
): Promise<SyncResult> {
  try {
    if (!accessToken) {
      return { success: false, error: "Token akses Google tidak valid atau kosong. Harap login ulang." };
    }

    // 1. Find or create the spreadsheet
    let spreadsheetId = await findExistingSpreadsheet(accessToken);
    let isNew = false;

    if (!spreadsheetId) {
      spreadsheetId = await createNewSpreadsheet(accessToken);
      isNew = true;
    }

    // 2. Prepare spreadsheet data mapping
    const studentRows = [
      ["NIS", "NISN", "Nama", "Jenis Kelamin", "Alamat", "Nama Ayah", "Nama Ibu", "Gaya Belajar", "Kondisi Keluarga", "Riwayat Kesehatan", "Minat Bakat", "Hari Piket", "Baris Kursi", "Kolom Kursi"],
      ...students.map((s) => [
        s.nis || "",
        s.nisn || "",
        s.nama || "",
        s.jk || "",
        s.alamat || "",
        s.namaAyah || "",
        s.namaIbu || "",
        s.gayaBelajar || "",
        s.kondisiKeluarga || "",
        s.riwayatKesehatan || "",
        s.minatBakat || "",
        s.hariPiket || "",
        s.seatRow !== undefined ? String(s.seatRow) : "",
        s.seatCol !== undefined ? String(s.seatCol) : ""
      ])
    ];

    const attendanceRows = [
      ["ID", "Tanggal", "NIS", "Nama", "Status"],
      ...attendance.map((a) => [
        a.id || "",
        a.tanggal || "",
        a.nis || "",
        a.nama || "",
        a.status || ""
      ])
    ];

    const assessmentRows = [
      ["ID", "NIS", "Nama", "Subjek", "Nilai", "Tanggal"],
      ...assessments.map((a) => [
        a.id || "",
        a.nis || "",
        a.nama || "",
        a.subjek || "",
        a.nilai !== undefined ? String(a.nilai) : "",
        a.tanggal || ""
      ])
    ];

    // If it's not a new spreadsheet, worksheets might have been deleted, or we just want to write to them.
    // Let's write the values to sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          valueInputOption: "USER_ENTERED",
          data: [
            {
              range: "Murid!A1:N",
              values: studentRows
            },
            {
              range: "Kehadiran!A1:E",
              values: attendanceRows
            },
            {
              range: "Asesmen!A1:F",
              values: assessmentRows
            }
          ]
        })
      }
    );

    // If writing fails on sheets, worksheets might be missing on an old spreadsheet (e.g. if the user created it manually).
    // Let's handle 400 Bad Request by attempting to create missing sheets.
    if (!response.ok) {
      const errText = await response.text();
      if (errText.includes("Unable to parse range") && !isNew) {
        // Old spreadsheet might be missing worksheets. Let's add them via batchUpdate.
        console.warn("Worksheets missing. Creating Murid, Kehadiran, and Asesmen sheets...");
        await ensureWorksheetsExist(accessToken, spreadsheetId);
        
        // Retry write
        const retryResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              valueInputOption: "USER_ENTERED",
              data: [
                { range: "Murid!A1:N", values: studentRows },
                { range: "Kehadiran!A1:E", values: attendanceRows },
                { range: "Asesmen!A1:F", values: assessmentRows }
              ]
            })
          }
        );

        if (!retryResponse.ok) {
          const retryErr = await retryResponse.text();
          throw new Error(`Gagal menulis data setelah membuat sheet: ${retryErr}`);
        }
      } else {
        throw new Error(`Gagal memperbarui nilai spreadsheet: ${errText}`);
      }
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl
    };
  } catch (error: any) {
    console.error("Excel Cloud Sync Error:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan yang tidak terduga saat sinkronisasi cloud."
    };
  }
}

/**
 * Ensures "Murid", "Kehadiran", and "Asesmen" worksheets exist on the spreadsheet.
 */
async function ensureWorksheetsExist(accessToken: string, spreadsheetId: string) {
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [
          { addSheet: { properties: { title: "Murid" } } },
          { addSheet: { properties: { title: "Kehadiran" } } },
          { addSheet: { properties: { title: "Asesmen" } } }
        ]
      })
    });
  } catch (e) {
    // Ignore if some sheets already exist or if we can't add them (the standard write retry will let us know)
    console.error("Error ensuring worksheets exist:", e);
  }
}
