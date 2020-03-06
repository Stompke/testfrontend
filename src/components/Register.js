import React from 'react';
import useForm from "./useForm";
import validate from "./validateLogin"
import { Button, Card } from '@material-ui/core';
import { axiosWithAuth } from '../utils/axiosWithAuth';

const Register = props => {
	const { handleChange, handleSubmit, values, errors } = useForm(submit, validate);
	
	function submit() {
		console.log("Submitted!");
		axiosWithAuth()
		.post("/users/register", values)
		.then(res => {
			localStorage.setItem("token", res.data.token);
			localStorage.setItem('id', res.data.id)
			props.history.push('/values-form')
			console.log(res);
		})
		.catch(err => {
			console.log('API Error ', err);
		})

	}

	return (
		<Card style={{width: "400px", margin: "20px auto"}}>
			<h2>Create Account</h2>
			<form onSubmit={handleSubmit} noValidate>

				<div>
					<label>Name</label>
					<div>
						<input 
							className={`${errors.name && "inputError"}`}
							name="name" 
							type="name" 
							value={values.name} 
							onChange={handleChange}
						/>
						{errors.name && <p className="error">{errors.name}</p>}
					</div>
				</div>

				<div>
					<label>Email</label>
					<div>
						<input 
							className={`${errors.email && "inputError"}`}
							name="email" 
							type="email" 
							value={values.email} 
							onChange={handleChange}
						/>
						{errors.email && <p className="error">{errors.email}</p>}
					</div>
				</div>

				<div>
					<label>Password</label>
					<div>
						<input 
							className={`${errors.password && "inputError"}`}
							name="password" 
							type="password" 
							value={values.password}
							onChange={handleChange}
						/>
						{errors.password && <p className="error">{errors.password}</p>}
					</div>
				</div>

				<Button type="submit">Submit</Button>

			</form>
		</Card>
	);
};

export default Register;
