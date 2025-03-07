// add testcase for CheckoutPopup
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPopup from './CheckoutPopup';

const mockHandleCheckout = jest.fn();
const mockOnClose = jest.fn();

const items = [
  { id: 1, name: 'Item 1', price: 100, quantity: 2 },
  { id: 2, name: 'Item 2', price: 50, quantity: 1 },
];

const total = 250;
const discountAmount = 50;

test('renders CheckoutPopup and shows correct total', () => {
  render(
    <CheckoutPopup
      items={items}
      total={total}
      discountAmount={discountAmount}
      onClose={mockOnClose}
      handleCheckout={mockHandleCheckout}
    />
  );


  expect(screen.getByText(/Total/)).toBeInTheDocument();
  expect(screen.getByText(`${total.toFixed(2)} Baht`)).toBeInTheDocument();


  expect(screen.getByText(/Discount/)).toBeInTheDocument();
  expect(screen.getByText(`-${discountAmount.toFixed(2)} Baht`)).toBeInTheDocument();


  expect(screen.getByText('Cancel')).toBeInTheDocument();
  expect(screen.getByText('Confirm')).toBeInTheDocument();
});

test('clicking Cancel button calls onClose', () => {
  render(
    <CheckoutPopup
      items={items}
      total={total}
      discountAmount={discountAmount}
      onClose={mockOnClose}
      handleCheckout={mockHandleCheckout}
    />
  );

  fireEvent.click(screen.getByText('Cancel'));


  expect(mockOnClose).toHaveBeenCalledTimes(1);
});