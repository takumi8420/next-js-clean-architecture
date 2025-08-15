import { render, screen } from '@testing-library/react';
import { Avatar } from '@/ui/components/common/Avatar';

describe('Avatar', () => {
  describe('rendering', () => {
    it('should render with initials from single name', () => {
      render(<Avatar name="田中" />);

      const avatar = screen.getByText('田中');
      expect(avatar).toBeInTheDocument();
    });

    it('should render with initials from full name', () => {
      render(<Avatar name="田中 太郎" />);

      const avatar = screen.getByText('田太');
      expect(avatar).toBeInTheDocument();
    });

    it('should render with initials from multiple words', () => {
      render(<Avatar name="John Doe Smith" />);

      const avatar = screen.getByText('JS');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      render(<Avatar name="Test" size="sm" />);

      const avatarContainer = screen.getByText('TE');
      expect(avatarContainer).toHaveClass('w-8', 'h-8', 'text-xs');
    });

    it('should apply medium size classes by default', () => {
      render(<Avatar name="Test" />);

      const avatarContainer = screen.getByText('TE');
      expect(avatarContainer).toHaveClass('w-10', 'h-10', 'text-sm');
    });

    it('should apply large size classes', () => {
      render(<Avatar name="Test" size="lg" />);

      const avatarContainer = screen.getByText('TE');
      expect(avatarContainer).toHaveClass('w-12', 'h-12', 'text-base');
    });
  });

  describe('status indicator', () => {
    it('should show online status', () => {
      const { container } = render(<Avatar name="Test" status="online" />);

      const statusIndicator = container.querySelector('.bg-green-500');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should show away status', () => {
      const { container } = render(<Avatar name="Test" status="away" />);

      const statusIndicator = container.querySelector('.bg-yellow-500');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should show offline status', () => {
      const { container } = render(<Avatar name="Test" status="offline" />);

      const statusIndicator = container.querySelector('.bg-gray-400');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should not show status indicator when no status provided', () => {
      const { container } = render(<Avatar name="Test" />);

      const statusIndicators = container.querySelectorAll(
        '[class*="bg-green"], [class*="bg-yellow"], [class*="bg-gray-400"]',
      );
      expect(statusIndicators).toHaveLength(0);
    });
  });

  describe('background color', () => {
    it('should generate consistent color for same name', () => {
      const { rerender } = render(<Avatar name="Test" />);
      const avatarContainer1 = screen.getByText('TE');
      const classes1 = avatarContainer1.className;

      rerender(<Avatar name="Test" />);
      const avatarContainer2 = screen.getByText('TE');
      const classes2 = avatarContainer2.className;

      expect(classes1).toBe(classes2);
    });

    it('should apply background color class', () => {
      render(<Avatar name="Test" />);
      const avatarContainer = screen.getByText('TE');

      // Check that it has one of the background color classes
      const hasBackgroundColor = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-gray-500',
      ].some((color) => avatarContainer.classList.contains(color));

      expect(hasBackgroundColor).toBe(true);
    });
  });
});
