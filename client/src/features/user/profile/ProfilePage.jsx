import Navbar from "../../../sharedComponents/user/navbar/Navbar";
import Header from "./components/header/Header";
import PreferencesForm from "./components/preferences/PreferencesForm";
import { useProfileLogic } from "./hooks/useProfileLogic";
import { usePreferencesForm } from "./hooks/usePreferencesForm";
import { PREFERENCE_OPTIONS } from "./constatnts/preferenceOptions";

const ProfilePage = () => {
  const { user, imageUpdate, submitPreferences, openEditModal } =
    useProfileLogic();
  const { form, isChanged, formState, syncInitialPreferences } =
    usePreferencesForm(user);

  const handleSubmit = async (data) => {
    syncInitialPreferences(data);
    await submitPreferences(data);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className=" rounded-full">
                    <Header
                      user={user}
                      imageUpdate={imageUpdate}
                      openEdit={openEditModal}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Your Profile
                </h1>
                <p className="text-gray-600">
                  Your profile preferences help Bookent personalize sports event
                  recommendations for you.
                </p>
              </div>

              <PreferencesForm
                form={form}
                isChanged={isChanged}
                onSubmit={handleSubmit}
                options={PREFERENCE_OPTIONS}
                externalSaving={formState.isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
