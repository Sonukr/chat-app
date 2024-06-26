import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth as auth } from '../../firebase/config';
import { NavLink, useNavigate } from 'react-router-dom'
import { Card, Input, Button } from 'antd';
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                navigate("/")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }

    return (

        <main >
            <section>

                <Card style={{ width: 300 }}>
                    <form>
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <Button
                                onClick={onLogin}
                            >
                                Login
                            </Button>
                        </div>
                    </form>

                    <p className="text-sm text-white text-center">
                        No account yet? {' '}
                        <NavLink to="/signup">
                            Sign up
                        </NavLink>
                    </p>
                </Card>

            </section>
        </main>

    )
}

export default Login