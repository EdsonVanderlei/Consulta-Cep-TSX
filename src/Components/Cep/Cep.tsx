import React from 'react'
import InputMask from 'react-input-mask'
import { CEP, schema, HttpService } from '../../Classes/Http'
import css from './Cep.module.css'
import { BiSearchAlt } from 'react-icons/bi'
import { MdGpsFixed } from 'react-icons/md'


interface State {
    data: CEP | null,
    error: string | null,
    loading: boolean,
}




const Cep = () => {

    const [state, setState] = React.useState<State>({
        data: null,
        error: null,
        loading: false
    });
    const [cep, setCep] = React.useState<string>('')
    const [Content, setContent] = React.useState<JSX.Element | null>(null)
    const HttpCep = new HttpService<CEP>('https://viacep.com.br/ws/', null);




    async function getData() {
        if (cep) {
            const Cep = cep.replace('-', '')
            if (Cep.length < 8 || null || undefined) {
                setState((prev) => ({...prev, error: 'Digite um Cep Válido'}))
                return;
            }
            if (Number(Cep)) {
                setState({ loading: true, data: null, error: null })
                const response = await HttpCep.get(`${Cep}/json/`)
                const result = schema.safeParse(response);
                if (result.success) {
                    setState((prev) => ({ ...prev, data: result.data, loading: false }))
                }
                else {
                    setState((prev) => ({ ...prev, error: 'Não foi encontrado esse cep', loading: false }))
                }
            }
        }
        else {
            setState((prev) => ({...prev, error: 'Digite um Cep Válido'}))
        }
    }

    function handlePress(e: KeyboardEvent) {
        if (e.keyCode === 13) {
            getData()
        }
    }

    React.useEffect(() => {
        window.addEventListener('keydown', handlePress, true);
        return () => window.removeEventListener('keydown', handlePress, true);
    }, [cep])




    return (
        <div className={css.Wrapper}>
            <div className={css.CepTitle}>DESCUBRA O MUNDO</div>
            <div className={css.InputWrapper}>
                <p className={css.InputTitle}>Digite o Cep 👇</p>
                <div className={css.SearchBox}>
                    <InputMask value={cep} onChange={({ target }) => setCep(target.value)} mask={'99999-999'} maskChar="" />
                    <button className={css.btnSend} onClick={getData}>🌎</button>
                </div>
                <div className={css.CepWrapper}>
                    {state.loading && <div className={css.loading}>
                        <li></li>
                        <li></li>
                        <li></li>
                    </div>}
                    {
                        state.error && <div className={css.error}>{state.error}</div>
                    }
                    {
                        state.data &&
                        <>
                        <div className={css.TitleResult}> Dados do Cep 🗺️</div>

                        <div className={css.CepInformations}>
                            <div><p>Bairro:</p> <span>{state.data.bairro}</span></div>
                            <div><p>Complemento:</p> <span>{state.data.complemento}</span></div>
                            <div><p>Cep:</p> <span>{state.data.cep}</span></div>
                            <div><p>Logradouro:</p> <span>{state.data.logradouro}</span></div>
                            <div><p>Localidade:</p> <span>{state.data.localidade}</span></div>
                            <div><p>UF:</p> <span>{state.data.uf}</span></div>
                            <div><p>DDD:</p> <span>{state.data.ddd}</span></div>
                        </div>
                        </>
                    }
                </div>


            </div>
        </div>
    )
}

export default Cep