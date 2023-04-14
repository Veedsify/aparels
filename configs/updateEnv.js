const fs = require('fs');
function updateEnv(updateArray) {
    const envVarsToEdit = updateArray
    // Read the existing .env file
    const envFileData = fs.readFileSync('.env', 'utf8')
    // Parse the existing data into key-value pairs
    const envFileVars = Object.fromEntries(
        envFileData.split('\n').map(line => line.split('='))
    )

    // Merge the updated values with the existing values
    const mergedVars = {
        ...envFileVars,
        ...Object.fromEntries(
            Object.entries(process.env)
                .filter(([key]) => envVarsToEdit.includes(key))
        )
    }

    // Convert the merged values to a string
    // Write the updated data to the .env file
    const envData = Object.entries(mergedVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    fs.writeFileSync('.env', envData)
    console.log('Updated .env file')
    const filePath = '.env'

    // Read the file content
    // Remove lines with "=undefined"
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const updatedContent = fileContent.split('\n')
        .filter(line => !line.includes('=undefined'))
        .join('\n\n')

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent)

    return true
}

module.exports = updateEnv