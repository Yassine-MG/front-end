// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// function ProtectedRoute({ component: Component, isAuthenticated, ...rest }) {
//     return (
//             <Route
//             {...rest}
//             render={(props) =>
//                 isAuthenticated ? (
//                 <Navigate to="/" replace />
//                 ) : (
//                 <Component {...props} />
//                 )
//             }
//             />
//     );
// }

// export default ProtectedRoute;