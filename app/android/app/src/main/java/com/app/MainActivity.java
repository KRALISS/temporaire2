package kraliss.com.android;
import android.os.Bundle; // here

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
// import com.crashlytics.android.Crashlytics;
// import io.fabric.sdk.android.Fabric;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);  // here
        super.onCreate(savedInstanceState);
        // Fabric.with(this, new Crashlytics());
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "app";
    }
    
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
