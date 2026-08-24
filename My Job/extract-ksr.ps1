$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$wb = $excel.Workbooks.Open('D:\Smart Volunteers PMI Kota Cilegon\My Job\ANGGOTA KSR POLKA.xlsx')
$ws = $wb.Worksheets.Item(1)
$data = $ws.UsedRange.Value2
$output = ""
for($i=1; $i -le [Math]::Min(20, $data.GetLength(0)); $i++) {
  for($j=1; $j -le [Math]::Min(20, $data.GetLength(1)); $j++) {
    $val = $data.GetValue($i,$j)
    if($val -ne $null) {
      $output += "[$i,$j]=$val`t"
    }
  }
  $output += "`n"
}
$output | Out-File 'D:\Smart Volunteers PMI Kota Cilegon\My Job\extracted\ksr_polka.txt'
$wb.Close($false)
$excel.Quit()
Write-Output 'Done'
