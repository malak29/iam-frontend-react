import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/stores';

const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  orgId: z.number().min(1, 'Organization ID is required'),
  departmentId: z.number().min(1, 'Department ID is required'),
  userTypeId: z.number().min(1, 'User type is required'),
  userStatusId: z.number().min(1, 'User status is required'),
  authTypeId: z.number().min(1, 'Auth type is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const { createUser, isLoading } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      orgId: 1,
      departmentId: 1,
      userTypeId: 2, // DEPT_USER
      userStatusId: 1, // ACTIVE
      authTypeId: 1, // PASSWORD
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await createUser(userData);
      reset();
      onClose();
    } catch (error) {
      // Error handled by store
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New User" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('name')}
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            disabled={isLoading}
          />
          
          <Input
            {...register('username')}
            label="Username"
            placeholder="johndoe"
            error={errors.username?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          error={errors.email?.message}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('password')}
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            disabled={isLoading}
          />
          
          <Input
            {...register('confirmPassword')}
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization ID
            </label>
            <select
              {...register('orgId', { valueAsNumber: true })}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value={1}>Organization 1</option>
              <option value={2}>Organization 2</option>
            </select>
            {errors.orgId && (
              <p className="mt-1 text-sm text-red-600">{errors.orgId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department ID
            </label>
            <select
              {...register('departmentId', { valueAsNumber: true })}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value={1}>Department 1</option>
              <option value={2}>Department 2</option>
            </select>
            {errors.departmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <select
              {...register('userTypeId', { valueAsNumber: true })}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value={1}>Guest User</option>
              <option value={2}>Department User</option>
              <option value={3}>Manager</option>
              <option value={5}>Department Head</option>
              <option value={8}>Organization Admin</option>
              <option value={10}>Super Admin</option>
            </select>
            {errors.userTypeId && (
              <p className="mt-1 text-sm text-red-600">{errors.userTypeId.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
          >
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;