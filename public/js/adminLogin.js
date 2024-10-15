document.getElementById('adminSigninFormBtn').addEventListener('click', (e)=>{
    e.preventDefault();
    const username=document.getElementById('adminUserName').value;
    const password = document.getElementById('adminPassword').value;

    if(username === "admin" && password === "admin123"){
        sessionStorage.setItem("isAuthenticated", 'true');

        window.location.href = "./dashboard.html"
    }else{
        alert("invalid username or password")
    }
})