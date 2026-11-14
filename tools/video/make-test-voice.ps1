Add-Type -AssemblyName System.Speech

$out = Join-Path $PSScriptRoot '..\..\output\test-voice.wav'
$out = [System.IO.Path]::GetFullPath($out)
New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Zira Desktop')
$synth.Rate = 0
$synth.Volume = 100
$synth.SetOutputToWaveFile($out)
$synth.Speak('Three cat astronauts. One crash landing. Seven sols to survive. Every sol, one choice.')
$synth.Dispose()

Write-Output $out
