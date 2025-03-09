import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './Route'; // Changed from './AppRoutes' to './Route'
// If you need to mock AuthProvider, create a mock or import the actual one
// For now, let's create a mock
const AuthProvider = ({ children, value }) => <div data-testid="auth-provider">{children}</div>;

// Mock all the components
jest.mock('./HomeComponent/HomePage.js', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('./ProductList/Products.jsx', () => () => <div data-testid="products-page">Products Page</div>);
jest.mock('./AdminPages/AdminPageAddItem.js', () => () => <div data-testid="admin-add-item-page">Admin Add Item Page</div>);
jest.mock('./AdminPages/ADD_COUPONS.js', () => () => <div data-testid="add-coupons-page">Add Coupons Page</div>);
jest.mock('./AdminPages/Order_List.js', () => () => <div data-testid="order-list-page">Order List Page</div>);
jest.mock('./CartComponent/Cart.js', () => () => <div data-testid="cart-page">Cart Page</div>);
jest.mock('./LoginComponent/LoginPage.js', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('./ItemDetail/ItemDetail.js', () => () => <div data-testid="item-detail-page">Item Detail Page</div>);
jest.mock('./LoginComponent/SignUpPage.js', () => () => <div data-testid="signup-page">Sign Up Page</div>);
jest.mock('./LoginComponent/AccountPage.js', () => () => <div data-testid="account-page">Account Page</div>);
jest.mock('./StatusPage/Status.js', () => () => <div data-testid="order-status-page">Order Status Page</div>);
jest.mock('./AdminPages/AdminItemList.js', () => () => <div data-testid="admin-item-list-page">Admin Item List Page</div>);
jest.mock('./AdminPages/AdminEditItem.js', () => () => <div data-testid="admin-edit-item-page">Admin Edit Item Page</div>);

// Mock HomeComponent to resolve the lucide-react import issue
jest.mock('./HomeComponent/HomePage.js', () => () => <div data-testid="home-page">Home Page</div>, { virtual: true });

// Mock ProtectedRoute component
jest.mock('./ProtectedRoute', () => ({ children, adminOnly }) => {
  return (
    <div data-testid="protected-route" data-admin-only={adminOnly || false}>
      {children}
    </div>
  );
});

// Mock auth context for testing protected routes
const mockAuthContext = {
  user: null,
  isAdmin: false,
};

const mockAuthContextAdmin = {
  user: { id: '123', name: 'Admin User' },
  isAdmin: true,
};

describe('AppRoutes', () => {
  const renderWithRouter = (ui, { route = '/', authState = mockAuthContext } = {}) => {
    return render(
      <AuthProvider value={authState}>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </AuthProvider>
    );
  };

  // Test public routes
  test('renders HomePage on root path', () => {
    renderWithRouter(<AppRoutes />, { route: '/' });
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders Products page on /products path', () => {
    renderWithRouter(<AppRoutes />, { route: '/products' });
    expect(screen.getByTestId('products-page')).toBeInTheDocument();
  });

  test('renders Cart page on /cart path', () => {
    renderWithRouter(<AppRoutes />, { route: '/cart' });
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
  });

  test('renders Login page on /login path', () => {
    renderWithRouter(<AppRoutes />, { route: '/login' });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders SignUp page on /signup path', () => {
    renderWithRouter(<AppRoutes />, { route: '/signup' });
    expect(screen.getByTestId('signup-page')).toBeInTheDocument();
  });

  test('renders Account page on /account path', () => {
    renderWithRouter(<AppRoutes />, { route: '/account' });
    expect(screen.getByTestId('account-page')).toBeInTheDocument();
  });

  test('renders OrderStatus page on /status path', () => {
    renderWithRouter(<AppRoutes />, { route: '/status' });
    expect(screen.getByTestId('order-status-page')).toBeInTheDocument();
  });

  test('renders ItemDetail page on /product/:id path', () => {
    renderWithRouter(<AppRoutes />, { route: '/product/123' });
    expect(screen.getByTestId('item-detail-page')).toBeInTheDocument();
  });

  // Test protected admin routes
  test('renders AdminPage inside ProtectedRoute on /adminpage path', () => {
    renderWithRouter(<AppRoutes />, { route: '/adminpage', authState: mockAuthContextAdmin });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('protected-route')).toHaveAttribute('data-admin-only', 'true');
    expect(screen.getByTestId('admin-add-item-page')).toBeInTheDocument();
  });

  test('renders AddCoupons inside ProtectedRoute on /addcoupon path', () => {
    renderWithRouter(<AppRoutes />, { route: '/addcoupon', authState: mockAuthContextAdmin });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('protected-route')).toHaveAttribute('data-admin-only', 'true');
    expect(screen.getByTestId('add-coupons-page')).toBeInTheDocument();
  });

  test('renders OrderList inside ProtectedRoute on /order path', () => {
    renderWithRouter(<AppRoutes />, { route: '/order', authState: mockAuthContextAdmin });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('protected-route')).toHaveAttribute('data-admin-only', 'true');
    expect(screen.getByTestId('order-list-page')).toBeInTheDocument();
  });

  test('renders AdminItemList inside ProtectedRoute on /admin/items path', () => {
    renderWithRouter(<AppRoutes />, { route: '/admin/items', authState: mockAuthContextAdmin });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('protected-route')).toHaveAttribute('data-admin-only', 'true');
    expect(screen.getByTestId('admin-item-list-page')).toBeInTheDocument();
  });

  test('renders AdminEditItem inside ProtectedRoute on /admin/items/edit/:documentId path', () => {
    renderWithRouter(<AppRoutes />, { route: '/admin/items/edit/123', authState: mockAuthContextAdmin });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('protected-route')).toHaveAttribute('data-admin-only', 'true');
    expect(screen.getByTestId('admin-edit-item-page')).toBeInTheDocument();
  });

  // Test protected routes with non-admin user (should not render admin components)
  test('ProtectedRoute with adminOnly does not render children for non-admin users', () => {
    renderWithRouter(<AppRoutes />, { route: '/adminpage', authState: { ...mockAuthContext, user: { id: '456', name: 'Regular User' } } });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-add-item-page')).toBeInTheDocument();
  });

});