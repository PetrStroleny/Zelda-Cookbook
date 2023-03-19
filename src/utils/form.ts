import { Ingredient } from "../pages/ingredients";

interface ValidateNumberErrors {
    baseError?: string
    maxValueError?: string
    negativeError?: string
    wholeError?: string
}

export function validateIsNumber(value: string, setError: (value: string) => void, maxNumber: number, mustBeWhole?: boolean, errors?: ValidateNumberErrors): boolean {
    if(isNaN(Number(value))) {
        setError(errors?.baseError ?? "Zadejte číslo");
        return false;
    }

    if(Number(value) > maxNumber) {
        setError(errors?.maxValueError ?? `Číslo nesmí být větší nežli ${maxNumber}`);
        return false;
    }

    if(Number(value) < 0) {
        setError(errors?.negativeError ?? "Číslo nesmí být menší nežli 0");
        return false;
    }

    if((value.indexOf(".") != -1) && mustBeWhole) {
        setError(errors?.wholeError ?? "Číslo musí být celé");
        return false;
    }

    setError("");
    return true;
}