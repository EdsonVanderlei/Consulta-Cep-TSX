import { z } from 'zod'

export type CEP = z.infer<typeof schema>

export const schema = z.object({
    cep: z.string(),
    logradouro: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    localidade: z.string(),
    uf: z.string(),
    ibge: z.string(),
    gia: z.string(),
    ddd: z.string(),
    siafi: z.string()
})

const schemaHeader = z.object({
    content: z.string(),
    authorization: z.string(),
})


type Header = z.infer<typeof schemaHeader>







export class HttpService<T>{

    url: string;
    headers: Header | null

    constructor(url:string, header: Header | null) {
        this.url =  url
        this.headers = header

    }

    public async get(route: string): Promise<T> {
        const response = await fetch(this.url + route).then(json => json).catch((e) => { throw new Error(e) });
        const json: Promise<T> = response.json();
        return json;
    }

}











