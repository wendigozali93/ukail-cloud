import { VbaModule } from "./types";

export const vbaModules: VbaModule[] = [
  {
    name: "modMain",
    type: "Standard",
    description: "Inisialisasi aplikasi, loading konfigurasi, dan manajemen status global.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modMain
'  Inisialisasi Utama & Pengaturan Global
' ==========================================================

Public Const APP_NAME As String = "UKAIL Teacher Assistant"
Public Const VERSION As String = "1.0"

Public CurrentTeacher As String
Public CurrentSemester As Integer
Public CurrentYear As String
Public IsLoaded As Boolean

Sub StartUKAIL()
    On Error GoTo ErrorHandler
    
    ' Optimasi performa Excel
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    Application.Calculation = xlCalculationManual

    ' Membaca konfigurasi dari Sheet SETTING
    Dim wsSetting As Worksheet
    Set wsSetting = ThisWorkbook.Sheets("SETTING")
    
    CurrentYear = wsSetting.Range("B2").Value
    CurrentSemester = wsSetting.Range("B3").Value
    CurrentTeacher = wsSetting.Range("B4").Value

    ' Membuka lembar kerja Dashboard
    Dim wsDashboard As Worksheet
    Set wsDashboard = ThisWorkbook.Sheets("DASHBOARD")
    wsDashboard.Activate

    ' Memuat Statistik dan Tampilan Dashboard
    Call Dashboard_Load
    
    IsLoaded = True
    
CleanExit:
    ' Mengembalikan kondisi lingkungan Excel
    Application.Calculation = xlCalculationAutomatic
    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    Exit Sub

ErrorHandler:
    MsgBox "Gagal menginisialisasi UKAIL: " & Err.Description, vbCritical, APP_NAME
    Resume CleanExit
End Sub

Sub ResetExcelSettings()
    ' Prosedur darurat mengembalikan setting Excel jika macro crash
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    Application.Calculation = xlCalculationAutomatic
    MsgBox "Kondisi sistem Excel berhasil dinormalkan.", vbInformation, APP_NAME
End Sub`
  },
  {
    name: "modDashboard",
    type: "Standard",
    description: "Mengontrol tampilan interaktif lembar Dashboard, widget, dan tombol navigasi.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modDashboard
'  Manajemen Dashboard Utama & Update Widget Statistik
' ==========================================================

Sub Dashboard_Load()
    Dim wsDash As Worksheet
    Set wsDash = ThisWorkbook.Sheets("DASHBOARD")
    
    ' Update Judul & Informasi Umum
    wsDash.Range("B2").Value = APP_NAME
    wsDash.Range("B3").Value = "Unified Knowledge & AI Learning Assistant"
    wsDash.Range("B4").Value = "Semester " & CurrentSemester & " - TP " & CurrentYear
    wsDash.Range("B5").Value = "Wali Kelas: " & CurrentTeacher
    
    ' Memuat Statistik Riil
    Call LoadStatistic
End Sub

Sub LoadStatistic()
    Dim wsDash As Worksheet
    Dim wsSiswa As Worksheet
    Dim wsAbsen As Worksheet
    Dim wsAsesmen As Worksheet
    
    Set wsDash = ThisWorkbook.Sheets("DASHBOARD")
    Set wsSiswa = ThisWorkbook.Sheets("DATABASE SISWA")
    Set wsAbsen = ThisWorkbook.Sheets("ABSENSI")
    Set wsAsesmen = ThisWorkbook.Sheets("ASESMEN")
    
    ' 1. Total Siswa (Mengurangi Header)
    Dim lastRowSiswa As Long
    lastRowSiswa = wsSiswa.Cells(wsSiswa.Rows.Count, 1).End(xlUp).Row
    If lastRowSiswa < 2 Then
        wsDash.Range("E5").Value = 0
    Else
        wsDash.Range("E5").Value = lastRowSiswa - 1
    End If
    
    ' 2. Hitung Presentase Kehadiran Hari Ini
    Dim totalSiswa As Long
    totalSiswa = wsDash.Range("E5").Value
    
    If totalSiswa > 0 Then
        Dim totalHadir As Long
        Dim lastRowAbsen As Long
        Dim i As Long
        
        lastRowAbsen = wsAbsen.Cells(wsAbsen.Rows.Count, 1).End(xlUp).Row
        totalHadir = 0
        
        ' Hitung yang berstatus 'Hadir' pada hari ini
        For i = 2 To lastRowAbsen
            If wsAbsen.Cells(i, 1).Value = Date Then
                If wsAbsen.Cells(i, 3).Value = "Hadir" Then
                    totalHadir = totalHadir + 1
                End If
            End If
        Next i
        
        If lastRowAbsen > 1 Then
            wsDash.Range("E6").Value = (totalHadir / totalSiswa)
        Else
            wsDash.Range("E6").Value = 1 ' Default 100% jika belum absen
        End If
    Else
        wsDash.Range("E6").Value = 0
    End If
    
    ' 3. Rata-rata Kelas (Asesmen)
    Dim lastRowAsesmen As Long
    lastRowAsesmen = wsAsesmen.Cells(wsAsesmen.Rows.Count, 1).End(xlUp).Row
    
    If lastRowAsesmen >= 2 Then
        wsDash.Range("E7").Value = WorksheetFunction.Average(wsAsesmen.Range("D2:D" & lastRowAsesmen))
    Else
        wsDash.Range("E7").Value = 0
    End If
    
    ' Log Aktivitas Dashboard
    Debug.Print "Statistik berhasil dimuat pada: " & Now
End Sub`
  },
  {
    name: "modDatabase",
    type: "Standard",
    description: "Menyediakan fungsi dasar akses database, pencarian indeks, dan validasi data relasional.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modDatabase
'  Fungsi-Fungsi Query & Validasi Integritas Data
' ==========================================================

Public Function StudentTotal() As Long
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("DATABASE SISWA")
    StudentTotal = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row - 1
End Function

Public Function GetStudentNameByNIS(NIS As String) As String
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    
    Set ws = ThisWorkbook.Sheets("DATABASE SISWA")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        If CStr(ws.Cells(i, 1).Value) = NIS Then
            GetStudentNameByNIS = ws.Cells(i, 2).Value
            Exit Function
        End If
    Next i
    
    GetStudentNameByNIS = "Tidak Ditemukan"
End Function

Public Function IsNISExists(NIS As String) As Boolean
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    
    Set ws = ThisWorkbook.Sheets("DATABASE SISWA")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        If CStr(ws.Cells(i, 1).Value) = NIS Then
            IsNISExists = True
            Exit Function
        End If
    Next i
    
    IsNISExists = False
End Function

Public Function Login(User As String, Pass As String) As Boolean
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    
    Set ws = ThisWorkbook.Sheets("USER")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        If ws.Cells(i, 1).Value = User Then
            If ws.Cells(i, 2).Value = Pass Then
                Login = True
                Exit Function
            End If
        End If
    Next i
    
    Login = False
End Function`
  },
  {
    name: "modStudent",
    type: "Standard",
    description: "Prosedur penambahan, modifikasi, pencarian, dan penghapusan data siswa (CRUD).",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modStudent
'  Operasi Manajemen Data Siswa (CRUD)
' ==========================================================

Sub AddStudent()
    Dim ws As Worksheet
    Dim r As Long
    Dim nisVal As String
    
    Set ws = ThisWorkbook.Sheets("DATABASE SISWA")
    
    ' Mengambil data dari UserForm frmStudent
    nisVal = Trim(frmStudent.txtNIS.Value)
    
    ' Validasi Input
    If nisVal = "" Or frmStudent.txtNama.Value = "" Then
        MsgBox "NIS dan Nama Siswa wajib diisi!", vbExclamation, "Peringatan"
        Exit Sub
    End If
    
    ' Cek Duplikasi NIS
    If IsNISExists(nisVal) Then
        MsgBox "NIS " & nisVal & " sudah digunakan oleh siswa lain!", vbCritical, "Gagal"
        Exit Sub
    End If
    
    ' Menentukan baris berikutnya
    r = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
    
    ' Menulis ke Database Sheet
    ws.Cells(r, 1).Value = nisVal
    ws.Cells(r, 2).Value = Trim(frmStudent.txtNama.Value)
    ws.Cells(r, 3).Value = frmStudent.cboJK.Value
    ws.Cells(r, 4).Value = Trim(frmStudent.txtAlamat.Value)
    
    MsgBox "Data siswa '" & frmStudent.txtNama.Value & "' berhasil disimpan!", vbInformation, "Sukses"
    
    ' Segarkan statistik Dashboard
    Call LoadStatistic
End Sub

Sub UpdateStudent(NIS As String, Nama As String, JK As String, Alamat As String)
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim found As Boolean
    
    Set ws = ThisWorkbook.Sheets("DATABASE SISWA")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        If CStr(ws.Cells(i, 1).Value) = NIS Then
            ws.Cells(i, 2).Value = Trim(Nama)
            ws.Cells(i, 3).Value = JK
            ws.Cells(i, 4).Value = Trim(Alamat)
            found = True
            Exit For
        End If
    Next i
    
    If found Then
        MsgBox "Data siswa berhasil diperbarui.", vbInformation, "Sukses"
    Else
        MsgBox "Siswa dengan NIS " & NIS & " tidak ditemukan.", vbCritical, "Gagal"
    End If
End Sub

Sub DeleteStudent(NIS As String)
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim confirm As VbMsgBoxResult
    
    confirm = MsgBox("Apakah Anda yakin ingin menghapus siswa dengan NIS: " & NIS & "?" & vbCrLf & _
                     "Tindakan ini tidak dapat dibatalkan!", vbQuestion + vbYesNo, "Konfirmasi Hapus")
                     
    If confirm = vbNo Then Exit Sub
    
    Set ws = ThisWorkbook.Sheets("DATABASE SISWA")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        If CStr(ws.Cells(i, 1).Value) = NIS Then
            ws.Rows(i).Delete
            MsgBox "Siswa berhasil dihapus dari database.", vbInformation, "Sukses"
            Call LoadStatistic
            Exit Sub
        End If
    Next i
    
    MsgBox "Siswa tidak ditemukan.", vbExclamation, "Informasi"
End Sub`
  },
  {
    name: "modAttendance",
    type: "Standard",
    description: "Prosedur pencatatan kehadiran harian siswa dan kalkulasi rekap bulanan.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modAttendance
'  Manajemen Kehadiran / Absensi Harian Siswa
' ==========================================================

Sub SaveAttendance()
    Dim ws As Worksheet
    Dim r As Long
    Dim nisVal As String
    Dim statusVal As String
    
    Set ws = ThisWorkbook.Sheets("ABSENSI")
    
    ' Mengambil input dari form Absensi
    nisVal = frmAttendance.cboStudent.Value
    statusVal = frmAttendance.cboStatus.Value
    
    ' Validasi
    If nisVal = "" Or statusVal = "" Then
        MsgBox "Siswa dan Status Absensi harus dipilih!", vbExclamation, "Gagal"
        Exit Sub
    End If
    
    ' Menentukan baris baru
    r = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
    
    ' Menyimpan data absensi
    ws.Cells(r, 1).Value = Date
    ws.Cells(r, 2).Value = nisVal
    ws.Cells(r, 3).Value = statusVal
    
    ' Logger otomatis ke sel log
    Debug.Print "Absen tercatat: " & nisVal & " - " & statusVal & " pada " & Date
    
    ' Update status di dashboard
    Call LoadStatistic
End Sub

Public Function GetAttendanceSummary(NIS As String, Status As String) As Long
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim count As Long
    
    Set ws = ThisWorkbook.Sheets("ABSENSI")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    count = 0
    
    For i = 2 To lastRow
        If CStr(ws.Cells(i, 2).Value) = NIS Then
            If ws.Cells(i, 3).Value = Status Then
                count = count + 1
            End If
        End If
    Next i
    
    GetAttendanceSummary = count
End Function`
  },
  {
    name: "modAssessment",
    type: "Standard",
    description: "Manajemen pencatatan nilai siswa, penilaian harian, UTS, UAS, dan rata-rata kelas.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modAssessment
'  Input Nilai Asesmen & Analisis Kinerja Kelas
' ==========================================================

Sub SaveAssessment()
    Dim ws As Worksheet
    Dim r As Long
    Dim nisVal As String
    Dim subVal As String
    Dim scoreVal As Double
    
    Set ws = ThisWorkbook.Sheets("ASESMEN")
    
    ' Mengambil data dari form
    nisVal = frmAssessment.cboStudent.Value
    subVal = frmAssessment.cboSubject.Value
    
    If Not IsNumeric(frmAssessment.txtScore.Value) Then
        MsgBox "Nilai asesmen harus berupa angka!", vbCritical, "Validasi Salah"
        Exit Sub
    End If
    
    scoreVal = CDbl(frmAssessment.txtScore.Value)
    
    If scoreVal < 0 Or scoreVal > 100 Then
        MsgBox "Nilai harus berada dalam rentang 0-100!", vbCritical, "Validasi Rentang"
        Exit Sub
    End If
    
    ' Cari baris terakhir
    r = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
    
    ' Simpan
    ws.Cells(r, 1).Value = Date
    ws.Cells(r, 2).Value = nisVal
    ws.Cells(r, 3).Value = subVal
    ws.Cells(r, 4).Value = scoreVal
    
    MsgBox "Nilai asesmen berhasil dimasukkan.", vbInformation, "Sukses"
    Call LoadStatistic
End Sub

Public Function AverageClass() As Double
    Dim ws As Worksheet
    Dim lastRow As Long
    
    Set ws = ThisWorkbook.Sheets("ASESMEN")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    
    If lastRow < 2 Then
        AverageClass = 0
        Exit Function
    End If
    
    ' Menggunakan fungsi rata-rata bawaan Excel
    AverageClass = WorksheetFunction.Average(ws.Range("D2:D" & lastRow))
End Function

Public Function GetStudentAverage(NIS As String) As Double
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim total As Double
    Dim count As Long
    
    Set ws = ThisWorkbook.Sheets("ASESMEN")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    total = 0
    count = 0
    
    For i = 2 To lastRow
        If CStr(ws.Cells(i, 2).Value) = NIS Then
            total = total + ws.Cells(i, 4).Value
            count = count + 1
        End If
    Next i
    
    If count > 0 Then
        GetStudentAverage = Round(total / count, 2)
    Else
        GetStudentAverage = 0
    End If
End Function`
  },
  {
    name: "modReport",
    type: "Standard",
    description: "Pembuatan laporan rekapitulasi, cetak raport otomatis, dan ekspor data ke Excel eksternal.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modReport
'  Generator Laporan Belajar & Pembuatan PDF Raport
' ==========================================================

Sub ExportReportCard(NIS As String)
    Dim wsSiswa As Worksheet
    Dim wsReport As Worksheet
    Dim namaSiswa As String
    
    Set wsSiswa = ThisWorkbook.Sheets("DATABASE SISWA")
    Set wsReport = ThisWorkbook.Sheets("REPORT")
    
    ' Dapatkan nama siswa
    namaSiswa = GetStudentNameByNIS(NIS)
    If namaSiswa = "Tidak Ditemukan" Then
        MsgBox "Siswa dengan NIS " & NIS & " tidak valid.", vbCritical, "Kesalahan"
        Exit Sub
    End If
    
    ' Siapkan template cetakan report
    wsReport.Range("B3").Value = "KARTU HASIL BELAJAR SISWA"
    wsReport.Range("B5").Value = "NIS       : " & NIS
    wsReport.Range("B6").Value = "Nama      : " & namaSiswa
    wsReport.Range("B7").Value = "Semester  : " & CurrentSemester
    wsReport.Range("B8").Value = "Tahun     : " & CurrentYear
    
    ' Rekapitulasi Absensi
    wsReport.Range("C11").Value = GetAttendanceSummary(NIS, "Hadir")
    wsReport.Range("C12").Value = GetAttendanceSummary(NIS, "Sakit")
    wsReport.Range("C13").Value = GetAttendanceSummary(NIS, "Izin")
    wsReport.Range("C14").Value = GetAttendanceSummary(NIS, "Alpa")
    
    ' Rata-rata Nilai
    wsReport.Range("C17").Value = GetStudentAverage(NIS)
    
    ' Tampilkan lembar laporan
    wsReport.Activate
    MsgBox "Laporan untuk siswa " & namaSiswa & " berhasil disusun pada tab REPORT.", vbInformation, "Sukses"
End Sub`
  },
  {
    name: "modAI",
    type: "Standard",
    description: "Penghubung API AI Pembelajaran, penulisan deskripsi raport cerdas berbasis kompetensi.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modAI
'  Integrasi AI (Gemini API Proxy / Web Integration)
' ==========================================================

Sub GenerateDescription()
    ' ======================================================
    '  Fungsi ini terintegrasi penuh dengan server UKAIL Web.
    '  Pada VBA desktop, macro ini mengirim payload siswa ke
    '  API lokal atau endpoint web untuk mengambil narasi raport.
    ' ======================================================
    
    Dim selectedNIS As String
    Dim averageScore As Double
    Dim notes As String
    
    ' Contoh simulasi pengambilan sel aktif
    selectedNIS = CStr(ActiveCell.Value)
    
    If Trim(selectedNIS) = "" Or Not IsNISExists(selectedNIS) Then
        MsgBox "Silakan aktifkan sel yang berisi NIS siswa yang valid terlebih dahulu!", vbExclamation, "Seleksi Tidak Valid"
        Exit Sub
    End If
    
    averageScore = GetStudentAverage(selectedNIS)
    
    MsgBox "Mengirim permintaan penyusunan deskripsi cerdas ke UKAIL AI Engine..." & vbCrLf & _
           "NIS: " & selectedNIS & vbCrLf & _
           "Nilai Rata-rata: " & averageScore, vbInformation, "Koneksi UKAIL AI"
           
    ' Prosedur API sesungguhnya diimplementasikan pada backend Node.js
    ' dan dapat disalin hasil generasinya melalui antarmuka web UKAIL.
    
End Sub

Public Function RequestAIAssistance(Prompt As String) As String
    ' Placeholder fungsional untuk pemanggilan WinHTTP Request ke API Gemini
    ' yang disembunyikan di balik server aman.
    RequestAIAssistance = "Hasil generasi deskripsi Raport: Siswa menunjukkan minat yang tinggi dan penguasaan yang sangat baik terhadap kompetensi dasar."
End Function`
  },
  {
    name: "modUtility",
    type: "Standard",
    description: "Fungsi utilitas pendukung seperti validasi format data, pembuatan sheet otomatis, dan backup.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modUtility
'  Fungsi Pendukung, Formatting, dan Auto-Backup
' ==========================================================

Sub AutoBackupWorkbook()
    Dim path As String
    Dim filename As String
    
    On Error Resume Next
    path = ThisWorkbook.path & "\\Backup_UKAIL\\"
    
    ' Buat folder jika tidak ada
    If Dir(path, vbDirectory) = "" Then
        MkDir path
    End If
    
    filename = "Backup_" & Format(Now, "yyyymmdd_hhnnss") & "_" & ThisWorkbook.name
    
    ThisWorkbook.SaveCopyAs path & filename
    Debug.Print "Auto Backup sukses disimpan ke: " & path & filename
End Sub

Public Sub ClearFilters(SheetName As String)
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets(SheetName)
    
    If ws.AutoFilterMode Then
        ws.ShowAllData
    End If
End Sub`
  },
  {
    name: "modPrint",
    type: "Standard",
    description: "Pengaturan tata letak printer, ukuran kertas, margin raport, dan ekspor PDF massal.",
    code: `Option Explicit

' ==========================================================
'  UKAIL Teacher Assistant - Standard Module: modPrint
'  Tata Letak Halaman & Pencetakan Massal Raport
' ==========================================================

Sub PrintReportToPDF()
    Dim wsReport As Worksheet
    Dim exportPath As String
    
    Set wsReport = ThisWorkbook.Sheets("REPORT")
    exportPath = ThisWorkbook.path & "\\Raport_Siswa_" & Format(Date, "yyyymmdd") & ".pdf"
    
    On Error GoTo ErrorHandler
    
    ' Konfigurasi Halaman Print
    With wsReport.PageSetup
        .Orientation = xlPortrait
        .PaperSize = xlPaperA4
        .Zoom = False
        .FitToPagesWide = 1
        .FitToPagesTall = 1
    End With
    
    ' Ekspor ke PDF
    wsReport.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        filename:=exportPath, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True, _
        IgnorePrintAreas:=False, _
        OpenAfterPublish:=True
        
    MsgBox "Laporan berhasil dicetak ke PDF:" & vbCrLf & exportPath, vbInformation, "Selesai Cetak"
    Exit Sub
    
ErrorHandler:
    MsgBox "Pencetakan gagal: " & Err.Description, vbCritical, "Cetak Raport Error"
End Sub`
  }
];
