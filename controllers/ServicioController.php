<?php

namespace Controllers;

use http\Header;
use Model\Servicio;
use MVC\Router;

class ServicioController {

    public static function index(Router $router) {
        session_start();

        isAdmin();

        $servicios = Servicio::all();

        $router->render('admin/servicios/index', [
            'nombre' => $_SESSION['nombre'],
            'servicios' => $servicios
        ]);
    }

    public static function crear(Router $router) {
        session_start();

        isAdmin();

        $servicio = new Servicio;
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio->sincronizar($_POST);
            $alertas =$servicio->validarForm();

            if (empty($alertas)) {
                $servicio->guardar();
                Header('Location: /admin/servicios');
            }
        }
        $router->render('admin/servicios/crear', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function actualizar(Router $router) {
        session_start();

        isAdmin();

        if (!is_numeric($_GET['id'])) return;
        $servicio =  Servicio::find($_GET['id']);
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio->sincronizar($_POST);
            $alertas = $servicio->validarForm();

            if  (empty($alertas)) {
                $servicio->guardar();
                header('Location: /admin/servicios');
            }
        }
        $router->render('admin/servicios/actualizar', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function eliminar() {
        session_start();

        isAdmin();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $servicio = Servicio::find($id);
            $servicio->eliminar();
            Header('Location: /admin/servicios');
        }
    }

}