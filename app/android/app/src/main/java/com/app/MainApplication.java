package kraliss.com.android;

import android.app.Application;

import org.wonday.pdf.RCTPdfView;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.imagepicker.ImagePickerPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.wix.reactnativekeyboardinput.KeyboardInputPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// import com.smixx.fabric.FabricPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.zoontek.rnpermissions.RNPermissionsPackage; // <- add the RNPermissionsPackage import
import kraliss.com.android.generated.BasePackageList;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;

import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsPackage;

import com.reactnativecommunity.webview.RNCWebViewPackage;//add this import
import com.horcrux.svg.SvgPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), Arrays.<SingletonModule>asList());

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            // new FabricPackage(),
            new SvgPackage(),
            new RNCWebViewPackage(),//add line
            new RNGestureHandlerPackage(),
            new KeyboardInputPackage(this.getApplication()),
            new RNFetchBlobPackage(),
              new RNPermissionsPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RNSpinkitPackage(),
            new ReactNativePushNotificationPackage(),
            new LinearGradientPackage(),
            new RNLanguagesPackage(),
            new ImagePickerPackage(),
            new RNGooglePlacesPackage(),
            new ReactNativeDocumentPicker(),
            new RNDeviceInfo(),
            new RNCameraPackage(),
            new RCTPdfView(),
            new RNExitAppPackage(),
            new RNFusedLocationPackage(),
            new AsyncStoragePackage(),
            new ModuleRegistryAdapter(mModuleRegistryProvider),
            new ReactNativeFirebaseAppPackage(),
            new ReactNativeFirebaseCrashlyticsPackage()
              );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
