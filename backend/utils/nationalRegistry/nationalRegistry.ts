// we only check if the format is a belgian national registry number
// Format is (only numbers): XX.XX.XX-XXX.XX
export const nationalRegistryRegex = /^\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}$/;