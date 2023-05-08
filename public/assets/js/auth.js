/**
 * Register Form
 */
if (document.getElementsByClassName('register_form').length) {
    document.querySelector('.register_form').addEventListener('submit',e => {
        e.preventDefault();
        const email = document.getElementById('useremail').value;
        const name = document.getElementById('username').value;
        const password = document.getElementById('userpassword').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const location = document.getElementById('userlocation').value;
        register(name,email,password,passwordConfirm,location);
        document.querySelector(".loader").style.display = "block";
        document.querySelector(".loader_bg").style.display = "block";
    });
}

const register = async(name,email,password,passwordConfirm,location) => {
    try{
        const res = await axios({
            method:'POST',
            url: '/signup',
            data:{
                name,email,password,passwordConfirm,location
            }
        });
        if (res.data.status === 'success') {
            toastr.success(res.data.message, 'Success');
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            window.setTimeout(() => {
                window.location.href ='/login';
                document.querySelector(".loader").style.display = "none";
                document.querySelector(".loader_bg").style.display = "none";
            }, 1500);
        }
    }
    catch(err){
        let text = "";
        const error = err.response.data.message;
        const errors = error.replace('User validation failed:', '').split(',');
        errors.forEach(myFunction);
        document.querySelector(".error_message").innerHTML = text;
        function myFunction(item, index) {
            text += `<div class="alert alert-danger alert-dismissible fade show" role="alert">${item}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>        
            `; 
        }
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".loader_bg").style.display = "none";
    }
}

/**
 * Login Form
 */
 if (document.getElementsByClassName('login_form').length) {
    document.querySelector('.login_form').addEventListener('submit',e => {
        e.preventDefault();
        var formElement = document.querySelector(".login_form");
        var formData = new FormData(formElement);
        const email = document.getElementById('useremail').value;
        const password = document.getElementById('password-input').value;
        formData.append("email", email);
        formData.append("password", password);
        login(formData);
        document.querySelector(".loader").style.display = "block";
        document.querySelector(".loader_bg").style.display = "block";
    });
}

const login = async(formData) => {
    try{
        const res = await axios({
            method:'POST',
            url: '/signin',
            data:formData
        });
        if(res.data.status === 'fail'){
            toastr.error(res.data.message, 'Error');
            document.querySelector(".loader").style.display = "none";
            document.querySelector(".loader_bg").style.display = "none";
        }
        if (res.data.status === 'success') {
            toastr.success(res.data.message, 'Success');
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            window.setTimeout(() => {
                window.location.href ='/';
                document.querySelector(".loader").style.display = "none";
                document.querySelector(".loader_bg").style.display = "none";
            }, 1500);
        }
    }
    catch(err){
        // toastr.error(err.response.data.message, 'Error');
        // document.querySelector(".loader").style.display = "none";
        // document.querySelector(".loader_bg").style.display = "none";
        alert(err.response.data.message);
    }
}

/**
 * Forgot Password Form
 */
 if (document.getElementsByClassName('forgot_pass').length) {
    document.querySelector('.forgot_pass').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        forgotPassword(email);
        document.querySelector(".loader").style.display = "block";
        document.querySelector(".loader_bg").style.display = "block";
    });
}

const forgotPassword = async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/forgotPassword',
            data: {email},
        });

        if (res.data.status === 'success') {
            const token = res.data.token;
            toastr.success(res.data.message, 'Success');
            window.setTimeout(() => {
                location.assign('/reset-password?token='+token);
                document.querySelector(".loader").style.display = "none";
                document.querySelector(".loader_bg").style.display = "none";
            }, 1500);
        }
    }
    catch (err) {
        toastr.error('Please Provide a Email', 'Error');
    }
};

/**
 * Reset Password
 */
// Reset Password
if (document.getElementsByClassName('reset_pass').length) {
    document.querySelector('.reset_pass').addEventListener('submit', e => {
        e.preventDefault();
        const password = document.getElementById('password-input').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        var url = window.location;
        var token = new URLSearchParams(url.search).get('token');
        resetPassword(password, passwordConfirm, token);
        document.querySelector(".loader").style.display = "block";
        document.querySelector(".loader_bg").style.display = "block";
    });
}
const resetPassword = async (password, passwordConfirm, token) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/resetPassword/'+token,
            data: {password,passwordConfirm},
        });
        if(res.data.status === 'fail'){
            toastr.error(res.data.message, 'Error');
            document.querySelector(".loader").style.display = "none";
            document.querySelector(".loader_bg").style.display = "none";
        }
        if (res.data.status === 'success') {
            toastr.success(res.data.message, 'Success');
            window.setTimeout(() => {
                location.assign('/login');
                document.querySelector(".loader").style.display = "none";
                document.querySelector(".loader_bg").style.display = "none";
            }, 1500);
        }
    }
    catch (err) {
        let text = "";
        const error = err.response.data.message;
        const errors = error.replace('User validation failed:', '').split(',');
        errors.forEach(myFunction);
        document.querySelector(".error_message").innerHTML = text;
        function myFunction(item, index) {
            text += `<div class="alert alert-danger alert-dismissible fade show" role="alert">${item}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>        
            `; 
        }
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".loader_bg").style.display = "none";
    }
};


// Logout
if (document.getElementsByClassName('logout_btn').length) {
    document.querySelector('.logout_btn').addEventListener('click', function() {
        logout();
    });
}


const logout = async () => {
    localStorage.removeItem("currentUser");
    var now = new Date();
    var time = now.getTime();
    var expireTime = time;
    now.setTime(expireTime);
    document.cookie = 'jwt=;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    location.assign('/login');
}
