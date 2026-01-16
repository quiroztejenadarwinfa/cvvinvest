const users = [
  {
    id: 'user-001',
    email: 'usuario@ejemplo.com',
    name: 'Usuario Ejemplo',
    role: 'user',
    plan: 'gratuito',
    balance: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-002',
    email: 'test@test.com',
    name: 'Usuario Test',
    role: 'user',
    plan: 'estandar',
    balance: 5000,
    createdAt: new Date().toISOString()
  }
];

const passwords = {
  'usuario@ejemplo.com': 'Password123',
  'test@test.com': 'Test12345',
  'exe.main.darwin@gmail.com': 'admin12345'
};

console.log('✅ Usuarios simulados:');
console.log(JSON.stringify(users, null, 2));
console.log('\n✅ Contraseñas simuladas:');
console.log(JSON.stringify(passwords, null, 2));
