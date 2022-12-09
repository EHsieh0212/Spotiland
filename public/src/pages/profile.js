function Profile() {
  const [profile, setProfile] = React.useState();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const jwtToken = window.localStorage.getItem('jwtToken');
  React.useEffect(() => {
    api.getProfile(jwtToken).then((json) => setProfile(json.data));
  }, []);

  async function submit() {
    await api.signin({
     provider: "native",
     email:email,
     password:password
   }).then((json) => {
     {
       if(json.error){
         window.alert(JSON.stringify(json.error))
       }
       else{
         window.localStorage.setItem('jwtToken', json.data.access_token);
         return api.getProfile(json.data.access_token);
       }
     }
   })
   .then((json)=>setProfile(json.data))
 }
    function facebooklogin(){
      if (!jwtToken) {
        // window.alert('請先登入');
        fb.loadScript()
          .then(() => fb.init())
          .then(() => fb.getLoginStatus())
          .then((response) => {
            if (response.status === 'connected') {
              return Promise.resolve(response.authResponse.accessToken);
            }
            return fb.login().then((response) => {
              if (response.status === 'connected') {
                return Promise.resolve(response.authResponse.accessToken);
              }
              return Promise.reject('登入失敗');
            });
          })
          .then((accessToken) =>
            api.signin({
              provider: 'facebook',
              access_token: accessToken,
            })
          )
          .then((json) => {
            window.localStorage.setItem('jwtToken', json.data.access_token);
            console.log(jwtToken)
            return api.getProfile(json.data.access_token);
          })
          .then((json) => setProfile(json.data))
          .catch((error) => window.alert(error));
          return;
      }
    } 

  return (
    <div className="profile">
      {profile && (
        <div className="profile__content">
          <div className="profile__title">會員基本資訊</div>
          <img className="profile__image" src={"https://cdn.hk01.com/di/media/images/dw/20210509/468140284585578496958734.jpeg/FtCT8H1aF1C8Gom1cBQ-tVTO-rb5v9mjU_nOh1P5zoc?v=w1920"} />
          <div className="profileD">{profile.name}</div>
          <div className="profileD">{profile.email}</div>
          <button
            className="profileBtn" onClick={() => {
              // window.FB.logout();
              window.localStorage.removeItem('jwtToken');
              window.location.href = "/profile.html"
            }}>
            登出
          </button>
          <div className='lottery'>
            <a className="lottery-icon" id="lottery" href="/lottery.html"></a>
          </div>
        </div>
      )}
      {!profile &&(
           <div style={{textAlign:"center"}} className="mt-5">
           <h1>登入頁面</h1>
                 <div>帳號:
                   <input type="mail" id="username"  onChange={(e) => setEmail(e.target.value)}  placeholder="請輸入信箱"   ></input>
                   </div>
                 <div>密碼:
                 <input type="password" id="username"    onChange={(e) => setPassword(e.target.value)}  placeholder="請輸入密碼" ></input>
                 </div>
                 <button class="submit" onClick={submit}>Login</button>
                 <div className="d-flex justify-content-center me-3">
                  <a className="nav-link "  href="/sendemail.html" style={{color:"black",marginRight:"10px",textDecoration:'none'}}>忘記密碼</a>
                  <a className="nav-link ms-4"  id="content" style={{color:"#black",marginRight:"10px"}}>|</a>
                  <a className="nav-link "  href="/signup.html"  style={{color:"black",textDecoration:'none'}}>註冊</a>
                </div>
                <div  className="click__star">
                <div className="fb_img" onClick={facebooklogin}></div>
                </div>
           </div>
      )}
    </div>
  );
}

function App() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');


  return (
    <React.Fragment>
      <Header cartItems={cart} />
      <Profile />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));

