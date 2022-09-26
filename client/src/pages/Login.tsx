import { useState } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN_USER } from "graphql/mutations/userMutations"


const Signup = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [login] = useMutation(LOGIN_USER, {
        variables: credentials
    })

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { data } = await login()
        const { login: loginRes } = data
        if (loginRes.success) window.location.replace("/")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(prevVal => {
            return { ...prevVal, [e.target.name]: e.target.value }
        })
    }

    return (
        <div>
            <form className="max-w-sm flex flex-col space-y-3" onSubmit={(e) => handleFormSubmit(e)} >
                <input className="border" type="text" name="email" placeholder="Enter email" onChange={(e) => handleChange(e)} />
                <input className="border" type="password" name="password" placeholder="Enter password" onChange={(e) => handleChange(e)} />
                <button type="submit">Login</button>
                <a href="/signin">
                    Already have an account?
                </a>
            </form>

        </div>
    )
}

export default Signup