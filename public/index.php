<?php 

require_once __DIR__ . '/../includes/app.php';



use MVC\Router;
use Controllers\ServicioController;
use Controllers\AdminController;
use Controllers\APIController;
use Controllers\CitaController;
use Controllers\LoginController;

$router = new Router();

// Iniciar sesion
$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

// Recuperar password
$router->get('/olvide', [LoginController::class, 'olvide']);
$router->post('/olvide', [LoginController::class, 'olvide']);
$router->get('/recuperar', [LoginController::class, 'recuperar']);
$router->post('/recuperar', [LoginController::class, 'recuperar']);

// Crear cuenta
$router->get('/crear-cuenta', [LoginController::class, 'crearCuenta']);
$router->post('/crear-cuenta', [LoginController::class, 'crearCuenta']);

// Confirmar cuenta
$router->get('/confirmar-cuenta', [LoginController::class, 'confirmar']);
$router->get('/confirmacion', [LoginController::class, 'confirmacion']);

// AREA PRIVADA
$router->get('/cita', [CitaController::class, 'index']);

//ADMINISTRACION
$router->get('/admin', [AdminController::class, 'index']);
$router->post('/api/eliminar', [APIController::class, 'eliminar']);
$router->get('/admin/servicios', [ServicioController::class, 'index']);
$router->get('/admin/servicios/crear', [ServicioController::class, 'crear']);
$router->post('/admin/servicios/crear', [ServicioController::class, 'crear']);
$router->get('/admin/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/admin/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->get('/admin/servicios/eliminar', [ServicioController::class, 'eliminar']);
$router->post('/admin/servicios/eliminar', [ServicioController::class, 'eliminar']);

// API de citas
$router->get('/api/servicios', [APIController::class, 'index']);
$router->post('/api/citas', [APIController::class, 'guardar']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();