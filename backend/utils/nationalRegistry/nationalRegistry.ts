export function isValidNationalRegistryNumber(nationalRegistryNumber: string): boolean
{
    // we only check if the format is a belgian national registry number
    // Format is (only numbers): XX.XX.XX-XXX.XX
    const regex = /^\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}$/;
    return regex.test(nationalRegistryNumber);
}