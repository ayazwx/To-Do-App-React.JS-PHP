<?php

header("Access-Control-Allow-Origin: *",);


try {


    $db = new PDO('mysql:host=localhost;dbname=todo_php_react', 'root', 'root');

    //  create databse as "todo_php_react" then create table as "todos"
    //  then create structure:
    //   => id = type int - Auto increment
    //   => todo = type varchar
    //   => done = type tinyint

} catch(PDOException $e) {
    die($e->getMessage());
}

$data = json_decode(file_get_contents('php://input'), true);

//print_r($data)

$action = $_POST['action'];
$response = [];

switch($action){
    case 'todos':
        $query = $db->query('select * from todos order by id desc')->fetchAll(PDO::FETCH_ASSOC);
        $response = $query;

        break;

    case 'add-todo':

        $todo = $_POST['todo'];
        $data = [
            'todo' => $todo,
            'done' => 0
        ];

        $query = $db->prepare('INSERT INTO todos SET todo = :todo, done = :done');
        $insert = $query->execute($data);

        if ($insert) {
            $response = $db->lastInsertId();
            
        }else{
            $response['error'] = 'Unexpected problem and todo was not inserted!';
        }

        break;

    case 'delete-todo':

        $id = $_POST['id'];
        if(!$id) {
            $response['error'] = 'ID can not be missing!!!';
        } else {
            $delete = $db->exec('delete from todos where id = "' . $id . '"');

            if($delete) {
                $response['deleted'] = true;
            }else {
                $response['error'] = 'Todo could not be deleted!!!';
            }
        }

        break;

        case 'done-todo':
    
            $id = $_POST['id'];
        $done = $_POST['done'];
            if(!$id) {
                $response['error'] = 'ID can not be missing!!!';
            } else {
                $query = $db->prepare('select id from todos where id = :id');
            $todo = $query->execute([
                'id' => $id
            ]);

            $todo = $query->fetch(PDO::FETCH_ASSOC);
            if(!$todo) {
                $response['error'] = 'Todo could not found!!!';
            } else {
                $query = $db->prepare('update todos set done = :done where id = :id');
                $update = $query->execute([
                    'id' => $id,
                    'done' => $done
                ]);

                if($update) {
                    $response['done'] = true;
                }else {
                    $response['error'] = 'Error occurred while updating!!!';
                }
            }
            }
    
            break;
}

echo json_encode($response);


?>