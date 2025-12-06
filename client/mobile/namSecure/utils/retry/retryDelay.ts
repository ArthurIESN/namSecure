export const calculateExponentialDelay = (attempt: number): number =>
{
    const initialDelay = 1000; // 1s
    const maxDelay = 120000; // 2 min max
    return Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
};
