'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.permissions) setPermissions(data.user.permissions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!permissions.includes(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
