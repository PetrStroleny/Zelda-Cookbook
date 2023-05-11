export const GENERAL_ERROR_MESSAGE = "Něco se nepovedlo, zkuste to prosím později";

export async function getData(url: string) {
    try {
        const response = await fetch(`http://localhost:8000/${url}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });
        if (response.ok) {
            return await response.json();
        }

        throw  await response.json();
    } catch(e) {
        throw e;
    }
}

export async function postData(url: string, data: any) {
    try {
        await fetch(`http://localhost:8000/${url}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                accept: 'application/json',
            },
            body: JSON.stringify(data)
        });
    } catch(e) {
        throw e;
    }
}

export async function deleteData(url: string) {
    try {
        const response = await fetch(`http://localhost:8000/${url}`, {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
            },
        });
        if (response.ok) {
            return await response.json();
        }

        throw await response.json();
    } catch(e) {
        throw e;
    }
}