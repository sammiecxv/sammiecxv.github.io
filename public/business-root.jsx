/* Entry point for the business app at /business. Mounts SupplierMobileApp
   inside the phone shell. See consumer-root.jsx for the other app. */

function BusinessRoot() {
  const scale = useFitScale(390, 812 + 40);

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      <div className="phone">
        <StatusBar />
        <div className="phone-body">
          <SupplierMobileApp />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BusinessRoot/>);
