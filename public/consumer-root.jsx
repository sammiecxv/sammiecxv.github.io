/* Entry point for the consumer app at /consumer. Mounts ConsumerApp inside the
   phone shell. The business app is a separate page (business-root.jsx); you get
   between them from the AppSwitch on the sign-in screen. */

const TWEAK_DEFAULTS = {
  evidenceDepth: 'standard',
  landingTab: 'home',
  swatch: 'leaf',
  showCommunity: true,
};

function ConsumerRoot() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const scale = useFitScale(390, 812 + 40);

  return (
    <React.Fragment>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        <div className="phone">
          <StatusBar />
          <div className="phone-body">
            <ConsumerApp pov="consumer" tweaks={t} />
          </div>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Item detail" />
        <TweakRadio label="Evidence depth" value={t.evidenceDepth}
                    options={['summary', 'standard', 'forensic']}
                    onChange={(v) => setTweak('evidenceDepth', v)} />
        <TweakRadio label="Landing tab" value={t.landingTab}
                    options={['materials', 'story', 'circular']}
                    onChange={(v) => setTweak('landingTab', v)} />
        <TweakSection label="Passport" />
        <TweakRadio label="Garment swatch" value={t.swatch}
                    options={['indigo', 'madder', 'leaf']}
                    onChange={(v) => setTweak('swatch', v)} />
        <TweakToggle label="Community voices" value={t.showCommunity}
                     onChange={(v) => setTweak('showCommunity', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ConsumerRoot/>);
