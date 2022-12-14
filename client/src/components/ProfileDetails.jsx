import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../services/authService'


const ProfileDetails = ({profile}) => {
    const [isLoading, setIsLoading] = useState(false)
    const user =  useSelector(selectUser)
    console.log(user)
    const navigate = useNavigate()
    const initialState = {
        name:user?.name,
        email:user?.email,
        description:user?.description, 
        phoneNo:user?.phoneNo,
        cv:user?.cv
    }
    console.log(initialState)
    const [userProfile , setUserProfile] = useState(initialState)
    const [profileImage ,setProfileImage] = useState("")
    const handleInputChange = (e)=>{
        const {name , value} = e.target
        setUserProfile({...userProfile , [name]:value})
    }

    const handleImageChange = (e)=>{
        setProfileImage(e.target.files[0])
    }

    const saveProfile = async(e)=>{
        e.preventDefault()
        setIsLoading(true);
    try {


        const formData = {
          name: userProfile.name,
          phone: userProfile.phone,
          bio: userProfile.bio,
          photo: profileImage ? "imageURL" : profile.photo,
        };

        const data = await updateUser(formData);
        console.log(data);
        toast.success("User updated");
        navigate("/dashboard");
        setIsLoading(false);
      
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
        
    }

    
  return (
    <>
         <div class="col-xl-8">

          <div class="card">
            <div class="card-body pt-3">
             
              <ul class="nav nav-tabs nav-tabs-bordered">

                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                </li>

                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                </li>

                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                </li>

              </ul>
              <div class="tab-content pt-2">

                <div class="tab-pane fade show active profile-overview" id="profile-overview">

                <div className="row">
                <div className="col-xl-4">
                <div className="card">
                 <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                 <img src={profile?.cv} alt="Profile" className="rounded-circle" />
                </div>
                </div>
                </div>
                </div>
                  <h5 class="card-title">About</h5>
                  <p class="small fst-italic">{profile?.description}</p>

                  <h5 class="card-title">Profile Details</h5>



                  <div class="row">
                    <div class="col-lg-3 col-md-4 label ">Full Name</div>
                    <div class="col-lg-9 col-md-8">{profile?.name}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Company</div>
                    <div class="col-lg-9 col-md-8">Lueilwitz, Wisoky and Leuschke</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Job</div>
                    <div class="col-lg-9 col-md-8">Web Designer</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Country</div>
                    <div class="col-lg-9 col-md-8">USA</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Address</div>
                    <div class="col-lg-9 col-md-8">A108 Adam Street, New York, NY 535022</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Phone</div>
                    <div class="col-lg-9 col-md-8">{profile?.phoneNo}</div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Email</div>
                    <div class="col-lg-9 col-md-8">{profile?.email}</div>
                  </div>

               </div> 

                 <div class="tab-pane fade profile-edit pt-3" id="profile-edit">

                 
                  <form onSubmit={saveProfile}>
                    {/* <div class="row mb-3">
                      <label for="profileImage" class="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                      <div class="col-md-8 col-lg-9">
                        <img src="assets/img/profile-img.jpg" alt="Profile"/>
                        <div class="pt-2">
                          <a href="#" class="btn btn-primary btn-sm" title="Upload new profile image"><i class="bi bi-upload"></i></a>
                          <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image"><i class="bi bi-trash"></i></a>
                        </div>
                      </div>
                    </div> */}

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Full Name</label>
                      <div class="col-md-8 col-lg-9">
                        <input  type="text" class="form-control" id="fullName" name="name" value={userProfile?.name} onChange={handleInputChange}/>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label  class="col-md-4 col-lg-3 col-form-label">Description</label>
                      <div class="col-md-8 col-lg-9">
                      <input  type="text" class="form-control" id="fullName" name="description" value={userProfile?.description} onChange={handleInputChange}/>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="company" class="col-md-4 col-lg-3 col-form-label">Company</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="company" type="text" class="form-control" id="company" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Job" class="col-md-4 col-lg-3 col-form-label">Job</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="job" type="text" class="form-control" id="Job"/>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Country" class="col-md-4 col-lg-3 col-form-label">Country</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="country" type="text" class="form-control" id="Country" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Address" class="col-md-4 col-lg-3 col-form-label">Address</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="address" type="text" class="form-control" id="Address" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Phone</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="phoneNo" type="text" class="form-control" id="Phone" value={userProfile?.phoneNo} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="email" class="form-control" id="Email" value={userProfile?.email} onChange={handleInputChange} disabled/>
                        <p>Email Cannot be Changed</p>
                      </div>
                    </div>

                    

                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                  </form>

                </div>

                 

                <div class="tab-pane fade pt-3" id="profile-change-password">
                  <form>

                    <div class="row mb-3">
                      <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Current Password</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="password" type="password" class="form-control" id="currentPassword"/>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New Password</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="newpassword" type="password" class="form-control" id="newPassword"/>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="renewpassword" type="password" class="form-control" id="renewPassword"/>
                      </div>
                    </div>

                    <div class="text-center">
                      <button type="submit" class="btn btn-primary">Change Password</button>
                    </div>
                  </form> 

                 </div>

              </div> 
              </div>
              </div>
              </div>
               </>
  )
}

export default ProfileDetails