const base_url = 'http://68.183.239.165'

export async function apiCaller(api, body = {}) {
  try {
    let reqHeader = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (body !== {}) {
      reqHeader['body'] = JSON.stringify(body)
    }

    const res = await fetch(base_url + api, reqHeader)
    if (res.ok) {
      const data = await res.json()
      
      if (data.statusCode !== 200) {
        throw new Error(data.error)
      }
      return [data, undefined]
    }

    throw new Error("" + res.status + " " + res.statusText) 
  }
  catch (err) {
    return [undefined, err.message]
  }
}