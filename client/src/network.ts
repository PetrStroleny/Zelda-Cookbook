export async function getData(url: string) {
    console.log(`http://localhost:8000/${url}`);
    const response = await fetch(`http://localhost:8000/${url}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    return await response.json();
}

export async function postData(url: string, data: any) {
    await fetch(`http://localhost:8000/${url}`, {
        method: 'POST',
        headers: {
            accept: 'application/json',
        },
        body: data
    });
}

export async function deleteData(url: string) {
    await fetch(`http://localhost:8000/${url}`, { method: 'DELETE'});
}