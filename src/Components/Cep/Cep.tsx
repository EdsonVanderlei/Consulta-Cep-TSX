import React from 'react'
import InputMask from 'react-input-mask'
import { CEP, schema, HttpService } from '../../Classes/Http'
import css from './Cep.module.css'
import { BiSearchAlt } from 'react-icons/bi'
import { MdGpsFixed } from 'react-icons/md'


interface State {
    data: CEP | null,
    error: boolean,
    loading: boolean,
}




const Cep = () => {

    const [state, setState] = React.useState<State>({
        data: null,
        error: false,
        loading: false
    });
    const [cep, setCep] = React.useState<string>('')
    const [Content, setContent] = React.useState<JSX.Element | null>(null)
    const HttpCep = new HttpService<CEP>('https://viacep.com.br/ws/', null);




    async function getData() {
        if (cep) {
            const Cep = cep.replace('-', '')
            if (Cep.length < 8 || null || undefined) {
                setContent(<p className={css.error}>Digite Corretamente o Cep</p>)
                return;
            }
            if (Number(Cep)) {
                setState({ loading: true, data: null, error: false })
                const result = schema.safeParse(await HttpCep.get(`${Cep}/json/`));
                if (result.success) {
                    setState((prev) => ({ ...prev, data: result.data, loading: false }))
                }
                else {
                    setState((prev) => ({ ...prev, error: true, loading: false }))
                }
            }
        }
        else {
            setContent(<p className={css.error}>Digite Corretamente o Cep</p>)
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


    React.useEffect(() => {
        if (state.loading) {
            setContent(<div className={css.loading}>
                <li></li>
                <li></li>
                <li></li>
            </div>)
        }
        else if (state.error) {
            setContent(<p className={css.error}>Ocorreu um erro, tente novamente !</p>)
        }
        else {

            if (state.data) {
                const data = state.data

                setContent(<div className={css.CepInformations}>
                    <p>Bairro: <span>{data.bairro}</span></p>
                    <p>Complemento: <span>{data.complemento}</span></p>
                    <p>Cep: <span>{data.cep}</span></p>
                    <p>Logradouro: <span>{data.logradouro}</span></p>
                    <p>Localidade: <span>{data.localidade}</span></p>
                    <p>UF: <span>{data.uf}</span></p>
                    <p>DDD: <span>{data.ddd}</span></p>
                </div>)
            }


        }

    }, [state])

    return (
        <div className={css.Wrapper}>
            <div className={css.InputWrapper}>
                <p className={css.CepTitle}>Digite o <span>Cep</span>: </p>
                <div className={css.SearchBox}>
                    <InputMask value={cep} onChange={({ target }) => setCep(target.value)} mask={'99999-999'} maskChar="" />
                    <BiSearchAlt className={css.icon} onClick={getData} />
                </div>
                <div className={css.CepWrapper}>
                    <p className={css.TitleResult}>Dados do Cep <MdGpsFixed className={css.icon} />  </p>
                    {Content}
                </div>


            </div>
        </div>
    )
}

export default Cep