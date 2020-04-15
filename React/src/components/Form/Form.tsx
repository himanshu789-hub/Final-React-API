import * as React from 'react';
import UserService, {User} from '../../Models/User';
import './css/form.css';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import Redirection from './Redirection';
import {arrayBufferToBase64} from '../../utilities/util';
import profileImg from '../../../public/assests/profile.png';
import {NamePattern, PasswordPattern, EmailPattern} from '../../RegularExpression/regexp';
import { APIServer } from '../Connection/connection';
import { uploadServer } from './../Connection/connection';
interface IFormProps {
 history: any;
 match: any;
 IsLogIn: boolean;
 location: any;
}
interface IFormState {
 IsLogIn?: boolean;
 User?: User;
 showPassword: boolean;
 ImageSelected: string;
 ImageUploaded: any;
 ImageName: string;
 msg: string;
 isOnUpdate: boolean;
 src: any;
 confirmPassword: string;
 emailMsg: string;
 nameMsg: string;
 passwordMsg: string;
 isImageUploaded: boolean;
 imageMsg: string;
 ageMsg: string;
 genderMsg: string;
}
class Form extends React.Component<IFormProps, IFormState> {
 //    user: User;
 constructor(props) {
  super(props);
  const {
   match: {
    params: {id},
   },
  } = this.props;
  this.state = {
   User: {
    emailId: '',
    active: true,
    name: '',
    password: '',
    imageUploadedName: '',
    age:0,
    gender:''
   },
   showPassword: false,
   ImageSelected: '',
   IsLogIn: this.props.IsLogIn,
   ImageUploaded: null,
   ImageName: '',
   src: profileImg,
   msg: '',
   isOnUpdate: id == undefined ? false : true,
   confirmPassword: '',
   emailMsg: '',
   nameMsg: '',
   passwordMsg: '',
   isImageUploaded: false,
   imageMsg: '',
   ageMsg: '',
   genderMsg: '',
  };

  this.OnSumitClick = this.OnSumitClick.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.onFileUpload = this.onFileUpload.bind(this);
  this.togglePassword = this.togglePassword.bind(this);
  this.onSubmitValidate = this.onSubmitValidate.bind(this);
  this.handleDelete = this.handleDelete.bind(this);
  this.ImageUpload = this.ImageUpload.bind(this);
  this.handleCancel = this.handleCancel.bind(this);
 }
 handleDelete(event) {
  event.preventDefault();
  const {id} = this.state.User;
  UserService.Delete(id);
  this.props.history.push('/');
 }
 componentDidMount() {
  const {
   match: {
    params: {id},
   },
  } = this.props;

  if (id != undefined) {
   axios.get(APIServer+'User/GetById',{params:{id:id}}).then(res=>{
    const user:User = res.data;
    debugger; 
    axios
       .get(uploadServer + 'getProfileImage/' + user.imageUploadedName.toString(), {
         responseType: 'arraybuffer',
       })
       .then((response) => {
         const image = arrayBufferToBase64(response.data);
         this.setState({
           src: 'data:;base64,' + image,
           isOnUpdate: true,
           User: { ...user },
           isImageUploaded: true,
           ImageSelected: response.data.fileName,
           ImageName: response.data.fileName,
           ImageUploaded: null,
         });
       });
   })
  } else {
   const user: User = {
    emailId: '',
    active: true,
    password: '',
    name: '',
    imageUploadedName: '',
    gender: 'Male',
   };
   this.setState({
    isOnUpdate: false,
    User: {...user},
    src: profileImg,
   });
  }
 }
 togglePassword() {
  this.setState((state) => ({showPassword: !state.showPassword}));
 }

 async ImageUpload() {
  let data = new FormData();
  data.append('file', this.state.ImageUploaded);
  debugger;
  const res = await axios.post(uploadServer+'upload', data, {});

  if (res.status != 200) {
  } else {
   this.setState({
    ImageSelected: res.data.fileName,
    ImageName: res.data.fileName,
    isImageUploaded: true,
   });
  }
 }

 shouldComponentUpdate() {
  return true;
 }
 onFileUpload = (event) => {
  event.preventDefault();
  const {files} = event.target;
  const file = files[0];
  if (file) {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onloadend = (event) => {
    const {result} = event.target;
    this.setState({
     src: result,
     ImageName: file.name,
     ImageUploaded: file,
     isImageUploaded: true,
    });
   };
  }
 };
 handleChange(event) {
  const {name, value} = event.target;

  if (name == 'name' || name == 'emailId' || name == 'password' || name == 'gender' || name == 'age') {
   // this.user[name] = value;
   this.setState((state) => {
    return {User: {...state.User, [name]: value}};
   });
   //   this.setState({ User: this.user }, () => {
  } else {
   const newKey = {};
   newKey[name] = value;
   this.setState(newKey);
  }
 }
 handleCancel() {
  let {history} = this.props;
  const {id} = this.props.match.params;
  history.push('/home/' + id + '/content');
 }
 onSubmitValidate() {
  let validateResult: boolean = true;
  const {isImageUploaded, confirmPassword, IsLogIn} = this.state;
  const {password, name, emailId, age, gender} = this.state.User;

  if (password != confirmPassword) {
   this.setState({
    msg: 'Your Password Do Not Match With Confirm Password',
   });
   validateResult = false;
  } else this.setState({msg: ''});
  if (name.length == 0 || !NamePattern.test(name)) {
   this.setState({nameMsg: 'Please Enter Valid Name'});
   validateResult = false;
  } else this.setState({nameMsg: ''});

  if (emailId.length == 0 || !EmailPattern.test(emailId)) {
   this.setState({emailMsg: 'Please Enter Valid EmailId'});
   validateResult = false;
  } else this.setState({emailMsg: ''});
  if (password.length == 0 || !PasswordPattern.test(password)) {
   validateResult = false;
   this.setState({passwordMsg: 'Please Enter Valid Password'});
  } else this.setState({passwordMsg: ''});

  if (!isImageUploaded) {
   this.setState({imageMsg: 'Please, Upload an image'});
   validateResult = false;
  } else this.setState({imageMsg: ''});
  if (age < 18) {
   this.setState({ageMsg: 'Please, Enter Valid Age'});
   validateResult = false;
  } else this.setState({ageMsg: ''});
  return validateResult;
 }

 async OnSumitClick(event) {
  event.preventDefault();

  if (this.props.IsLogIn) {
   const {emailId, password} = this.state.User;
   let tempUser = UserService.IsUserExists(emailId, password);
   if (tempUser != undefined) {
    this.props.history.push('/home/' + tempUser.id + '/content');
   } else {
    this.setState({
     msg: 'Please, Enter valid Credentials ',
    });
   }
  } else {
   if (!this.onSubmitValidate()) return;
   const {isOnUpdate} = this.state;
   const {history} = this.props;
   debugger;
   const {User, ImageSelected, ImageUploaded} = this.state;

   let tempUser: User = {
    emailId: '',
    name: '',
    active: true,
    imageUploadedName: '',
    password: '',
   };
   tempUser = {...User};
   debugger;
   if (isOnUpdate) {
    debugger;
    if (ImageUploaded) {
     await this.ImageUpload();
     const {ImageSelected} = this.state;
     tempUser.imageUploadedName = ImageSelected;
    }
    tempUser = UserService.Update(tempUser);
   } else {
    await this.ImageUpload();
    const {ImageSelected} = this.state;
	   tempUser.imageUploadedName = ImageSelected;
	   axios.post(APIServer + 'User/Create', tempUser).then((response) => {
		   debugger;
	   });
     tempUser = UserService.Create({
       emailId: tempUser.emailId, name: tempUser.name, password: tempUser.password,
       age: tempUser.age,gender:tempUser.gender,imageUploadedName:tempUser.imageUploadedName
     });
   }
   history.push('/home/' + tempUser.id + '/content');
  }
 }

 render() {
  const {
   src,
   nameMsg,
   emailMsg,
   imageMsg,
   passwordMsg,
   IsLogIn,
   msg,
   User,
   isOnUpdate,
   showPassword,
   confirmPassword,
   ageMsg,
   genderMsg,
  } = this.state;

  return (
   <div id="container">
    <div id="image"></div>
    <div id="formBar" className={IsLogIn ? 'signUp' : 'logIn'}>
     <form id="form" onSubmit={this.OnSumitClick}>
      <label>{isOnUpdate ? 'Update Profile' : IsLogIn ? 'Log In' : 'Sign Up'}</label>
      <label className={'msg-display'}>{msg}</label>
      {IsLogIn ? (
       ''
      ) : (
       <>
        <div>
         <label className="form-msg">{nameMsg}</label>
         <input
          type="text"
          name="name"
          autoComplete="off"
          className="inputText"
          required
          value={User.name || ''}
          onChange={this.handleChange}
         />
         <span className="floating-label">Enter Your Name</span>
        </div>
        <div>
         <div className="ageSection">
          <label className="form-msg">{ageMsg}</label>
          <input
           type="text"
           name="age"
           required
           autoComplete="off"
           value={User.age || ''}
           onChange={this.handleChange}
          />
          <span className="floating-label">Enter Your Age</span>
         </div>
         <div className="genderSection">
          <label className="form-msg">{genderMsg}</label>
          <select
           id="gender"
           name="gender"
           className="inputText"
           defaultValue="Male"
           onChange={this.handleChange}
          >
           <option value="Male">Male</option>
           <option value="Female">Female</option>
           <option value="Other">Other</option>
          </select>
         </div>
        </div>
       </>
      )}
      <div>
       <label className="form-msg">{emailMsg}</label>
       <input
        type="text"
        name="emailId"
        className="inputText"
        autoComplete={'off'}
        required
        value={User.emailId || ''}
        onChange={this.handleChange}
       />
       <span className="floating-label">Enter Your Mail-Id</span>
      </div>

      <div className="password">
       <label className="form-msg">{passwordMsg}</label>
       <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        autoComplete="off"
        className="inputText"
        required
        value={User.password || ''}
        onChange={this.handleChange}
       />
       <span className="floating-label">Your Password</span>
      </div>
      <label id="passEye" onClick={this.togglePassword}>
       {!showPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
      </label>
      {IsLogIn ? (
       ' '
      ) : (
       <>
        {' '}
        <div className="password">
         <label className="form-msg"></label>
         <input
          type="password"
          name="confirmPassword"
          autoComplete="off"
          value={confirmPassword || ''}
          className="inputText"
          required
          onChange={this.handleChange}
         />
         <span className="floating-label">Confirm Password</span>
        </div>
        <div className="upload">
         <input type="file" onChange={this.onFileUpload} id="fileChoose" />

         <label htmlFor="fileChoose" className="uploadButton">
          Upload
         </label>
         <img src={src} className="image" alt="Image" />
        </div>
        <label className="form-msg form-upload-msg">{imageMsg}</label>
       </>
      )}
      {isOnUpdate ? (
       <aside className="update-section">
        {' '}
        <button className="delete-button" onClick={this.handleDelete}>
         Delete
        </button>
        <label className="cancel-label" onClick={this.handleCancel}>
         <i className="fas fa-ban"></i>
        </label>
       </aside>
      ) : (
       <></>
      )}
      <input
       type="submit"
       className={IsLogIn ? 'logIn' : 'signUp'}
       value="Submit"
       onClick={this.OnSumitClick}
      />
     </form>
     <Redirection IsLogIn={IsLogIn} />
    </div>
   </div>
  );
 }
}

export default withRouter(Form);
