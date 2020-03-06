export default function validate(values) {
	let errors = {};

	//console.log(values);
	//Name Errors, doesn't apply to login page
	// if(!values.name){
	// 	errors.name = "Enter a name";			
	// }

	//Email Errors
	if(!values.email) {
		errors.email = "Email address is required";
	} else if (!/\S+@\S+\.\S+/.test(values.email)){
		errors.email = "Email address is invalid";
	}

	//Password Errors
	if(!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password needs to be at least 6 characters";
	}

	return errors;
}