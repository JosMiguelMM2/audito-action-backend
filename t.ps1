$username = "csuescun"  # Cambia esto al nombre de usuario que deseas verificar

$password = "cliente2024*"  # Cambia esto a la contraseña que deseas verificar

$securePassword = ConvertTo-SecureString $password -AsPlainText -Force

$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)

try {
    $user = Get-ADUser -Identity $username -Credential $credential
    Write-Host "Credenciales correctas para el usuario: $($user.SamAccountName)"
} catch {
    Write-Host "Credenciales incorrectas para el usuario: $username"
}
