import ProfileForm from "./ProfileForm";
import useEditProfile from "../../hooks/useEditProfile";

const EditUserProfile = () => {
  const { form, sameEmail, sameFullname, submitHandler } = useEditProfile();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Edit User Profile
      </h2>

      <ProfileForm
        form={form}
        onSubmit={submitHandler}
        sameEmail={sameEmail}
        sameFullname={sameFullname}
      />
    </div>
  );
};

export default EditUserProfile;
