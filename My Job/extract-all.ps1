$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$files = @(
  'D:\Smart Volunteers PMI Kota Cilegon\My Job\Databased PMR.xlsx',
  'D:\Smart Volunteers PMI Kota Cilegon\My Job\DATA UNIT PMR TAHUN 2025.xlsx',
  'D:\Smart Volunteers PMI Kota Cilegon\My Job\LAPORAN KEGIATAN.xlsx',
  'D:\Smart Volunteers PMI Kota Cilegon\My Job\DATA FASILITATOR PMI PMI KOTA CILEGON 2026.xlsx'
)
$i = 0
foreach($f in $files) {
  $i++
  $wb = $excel.Workbooks.Open($f)
  $ws = $wb.Worksheets.Item(1)
  $data = $ws.UsedRange.Value2
  $name = Split-Path $f -Leaf
  $output = "=== $name ===`n"
  for($r=1; $r -le [Math]::Min(15, $data.GetLength(0)); $r++) {
    $row = ""
    for($c=1; $c -le [Math]::Min(15, $data.GetLength(1)); $c++) {
      $val = $data.GetValue($r,$c)
      if($val -ne $null) { $row += "$val`t" }
    }
    $output += "$row`n"
  }
  $output | Out-File "D:\Smart Volunteers PMI Kota Cilegon\My Job\extracted\file_$i.txt"
  $wb.Close($false)
}
$excel.Quit()
Write-Output 'Done'
