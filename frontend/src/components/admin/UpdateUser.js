import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUser, getUser } from "../../actions/userActions";
import { clearError, clearUser, clearUserUpdated } from "../../slices/userSlice";
import SideBar from "./Sidebar";


export default function UpdateUser() {
    const {loading, isUserUpdated, error, user={} } = useSelector(state => state.userState)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
   
    const dispatch = useDispatch();
    const {id} = useParams();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        dispatch(updateUser(id, formData))
    }
       
    useEffect(() => {
        if(user._id) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    },[user]) 

    useEffect(() => {
        if(isUserUpdated){
            toast('User Updated Successfully!', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearUserUpdated()) }
            })
            return ;
        }
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }

        
        if(!user._id) {
            dispatch(getUser(user._id))
        }
        return () => {
            dispatch(clearUser())
        }
       
    },[dispatch, error, isUserUpdated, user])


    return (
        <div className="row">
            <div className='col-12 col-md-2'>
                <SideBar/>
            </div>
            <div className="col-12 col-md-10">
          
                {/* Copied from UserOrders and modified to list admin products */}
                <Fragment>
                    
                <div class="row wrapper">
                <div class="col-10 col-lg-5">
                    <form onSubmit={submitHandler} class="shadow-lg">
                        <h1 class="mt-2 mb-5">Update User</h1>

                        <div class="form-group">
                            <label for="name_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								class="form-control"
                                name='name'
                                onChange={e => setName(e.target.value)}
                                value={name}
                            />
                        </div>

                        <div class="form-group">
                            <label for="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                class="form-control"
                                name='email'
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <div class="form-group">
                                    <label for="role_field">Role</label>

                                    <select
                                        id="role_field"
                                        class="form-control"
                                        name='role'
                                        onChange={e => setRole(e.target.value)}
                                        value={role}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                        <button disabled={loading} type="submit"  class="btn update-btn btn-block mt-4 mb-3" >Update</button>
                    </form>
                </div>
            </div>
                </Fragment>
            </div>
        </div>
    )
}