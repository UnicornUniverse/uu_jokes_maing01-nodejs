import UU5 from "uu5g04";
import Plus4U5App from "uu_plus4u5g02-app";

export default function withSuspense(Route) {
  return (props) => {
    return (
      <UU5.Common.Suspense fallback={<Plus4U5App.RoutePending />}>
        <Route {...props} />
      </UU5.Common.Suspense>
    );
  };
}
