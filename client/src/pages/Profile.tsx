import Header from '../components/layout/Header';

export default function Profile() {
  return (
    <div>
      <Header title="Profile" />
      <div className="max-w-2xl">
        <div className="card">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 mb-6">
            <div className="bg-primary-100 p-4 rounded-full flex-shrink-0">
              <span className="text-4xl">👤</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Admin PMI Kota Cilegon</h3>
              <p className="text-sm lg:text-base text-gray-600 mt-1">cuklay@gmail.com</p>
              <span className="inline-block mt-3 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                Administrator
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" className="input-field" defaultValue="Admin PMI Kota Cilegon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="input-field" defaultValue="cuklay@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input type="text" className="input-field" defaultValue="Administrator" disabled />
            </div>
            <div className="pt-4">
              <button className="btn-primary w-full sm:w-auto">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
