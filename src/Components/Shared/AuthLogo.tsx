const AuthLogo = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <img
        src="/images/logo.png"
        alt="ম্যাগট-ফ্রি কিট"
        className="w-16 h-16 object-contain rounded-2xl mb-4"
      />
      <h1 className="text-xl sm:text-2xl font-bold text-secondary-color">
        ম্যাগট-ফ্রি কিট ড্যাশবোর্ড
      </h1>
    </div>
  );
};

export default AuthLogo;
