var chess = angular.module('chess', []);

chess.controller('boardCtrl', ['$scope', '$log', '$compile', '$http',
    function($s, $l, $compile, $http) {
        $s.board_size = 12;
        $s.lock = false;
        $s.init = function () {
            $s.color = {
            'T': 'R',
            'L': 'Y',
            'R': 'G',
            'B': 'B'
        };
            $s.side = {
            'R': 'T',
            'Y': 'L',
            'G': 'R',
            'B': 'B'
        };
            $s.set_my_side('B');
            $s.piece_board = $("#piece_board");
            $s.high_board = $("#high_board");
            // $s.
            $s.start_game();
        };
        $s.set_my_side = function (side) {
            $s.my_side = side;
            $s.my_color = $s.color[side];
            $s.bMtx[0][0] = $s.bMtx[0][1] = $s.bMtx[0][10] = $s.bMtx[0][11] = '---'+$s.my_side;
            $s.bMtx[1][0] = $s.bMtx[1][1] = $s.bMtx[1][10] = $s.bMtx[0][11] = '---'+$s.my_side;
            $s.bMtx[10][0] = $s.bMtx[10][1] = $s.bMtx[10][10] = $s.bMtx[10][11] = '---'+$s.my_side;
            $s.bMtx[11][0] = $s.bMtx[11][1] = $s.bMtx[11][10] = $s.bMtx[11][11] = '---'+$s.my_side;
        };
        $s.start_game = function () {
            $s.render_game(
                "20rT,30nT,40bT,50qT,60kT,70bT,80nT,90rT," +
                "2brB,3bnB,4bbB,5bqB,6bkB,7bbB,8bnB,9brB," +
                "02rL,03nL,04bL,05qL,06kL,07bL,08nL,09rL," +
                "b2rR,b3nR,b4bR,b5qR,b6kR,b7bR,b8nR,b9rR," +
                "21pT,31pT,41pT,51pT,61pT,71pT,81pT,91pT," +
                "2apB,3apB,4apB,5apB,6apB,7apB,8apB,9apB," +
                "a2pR,a3pR,a4pR,a5pR,a6pR,a7pR,a8pR,a9pR," +
                "12pL,13pL,14pL,15pL,16pL,17pL,18pL,19pL"
            );
        };
        $s.P = function (piece) {
            /* piece: full piece name
             * Return: 2 char string: <Piece type>+<Side> */
            return piece.substr(2,2);
        };
        $s.C = function (piece) {
            /* piece: full piece name
             * return coord in string <X>+<Y>*/
            return piece.substr(0,2);
        };
        $s.I = function (ch) {
            /* Return: Int corresponding to given hex char */
            return parseInt(ch, 16);
        };
        $s.S16 = function (int) {
            /* Return: (hex)char corresponding to given int */
            return int.toString(16);
        };
        $s.S10 = function (int) {
            /* Return: (deci)char corresponding to given int */
            return int.toString();
        };
        $s.bMtx = [
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
        ];
        $s.current_piece = 0;
        $s.coordinates = function (s) {
            /* s: string of len 2 or more,
            *     containing coords in 1st two chars
            *  return: int coords as [(), ()] */
            return [$s.I(s[0]), $s.I(s[1])];
        };
        $s.render_game = function (states) {
            var s = states.split(',');
            for(var i=0; i < s.length; ++i){
                $s.add_piece(s[i]);
            }
        };
        $s.add_piece = function (piece) {
            if(!($s.bMtx[$s.I(piece[0])][$s.I(piece[1])]===0))
                $s.delete_piece($s.bMtx[$s.I(piece[0])][$s.I(piece[1])]);
            $s.bMtx[$s.I(piece[0])][$s.I(piece[1])] = piece;
            $s.piece_board.append($compile($s.createPiece(piece))($s));
        };
        $s.createPiece = function (piece) {
            var click_event = '';
            var piece_class = 'piece';
            if(piece[3]===$s.my_side) {
                click_event = 'ng-click="piece_clicked($event)" ';
                piece_class = 'piece-my';
            }
            return '<img class="'+piece_class+'" id="'+piece+'" ng-src="img/'+
                piece[2]+$s.color[piece[3]]+'.svg" style="transform: translate('+
                $s.S10($s.I(piece[0]))+'00%, '+$s.S10($s.I(piece[1]))+'00%)"'+
                click_event+'/>'
        };
        $s.highlight_squares = function (coords) {
            /* coord: Array of two integers
            *  Squares are always highlighted in $s.my_-color
            */
            $s.high_board.html("");
            for(var i=0; i<coords.length; ++i){
                $s.high_board.append($compile(
                    '<div id="'+coords[i]+'hi" class="highlight '+$s.my_color+
                    '" style="transform: '+'translate('+
                    $s.S10($s.I(coords[i][0]))+'00%, '+$s.S10($s.I(coords[i][1]))+'00%)"' +
                    'ng-click="highlighted_clicked($event)"></div>')($s));
            }
        };
        $s.clear_highlights = function () {
            $s.high_board.html('');
        };
        $s.piece_clicked = function (e) {
            if($s.lock) return;
            var piece = e.currentTarget.id;
            $l.log('clicked '+ piece);
            $s.current_piece = piece;
            var moves = $s.get_possible_moves(piece);
            $s.highlight_squares(moves);
        };
        $s.highlighted_clicked = function (e) {
            $s.lock = true;
            var coord = $s.C(e.currentTarget.id);
            var piece = $s.current_piece;
            $l.log("highlighed sq clicked - "+coord);
            if($s.legal_move(coord)){
                $s.delete_piece($s.current_piece);
                $s.add_piece(coord+$s.P(piece));
                $s.clear_highlights();
            }
            $s.lock = false;
        };
        $s.delete_piece = function (piece) {
            $('#'+piece).remove();
            $s.bMtx[$s.I(piece[0])][$s.I(piece[1])]=0;
        };
        $s.valid_sq = function (sq) {
            return -1 === $.inArray(sq, [
                                            '00', '01', '0a', '0b',
                                            '10', '11', '1a', '1b',
                                            'a0', 'a1', 'aa', 'ab',
                                            'b0', 'b1', 'ba', 'bb'
                                        ])
        };
        $s.get_possible_moves = function (piece){
            return $s.possible_moves[piece[2]]($s.coordinates($s.C(piece)), piece[3])
        };
        $s.possible_moves = {
            /* coord: [int, int]
             */
            'r': function (coord, side) {
                var moves = [];
                var i; var j;
                i = coord[0]+1; j=coord[1];
                while(i < $s.board_size){
                    if($s.bMtx[i][j]===0){
                        moves.push($s.S16(i)+$s.S16(j)); ++i;
                    }else if($s.bMtx[i][j][3] === $s.my_side){
                        break;
                    }else {
                        moves.push($s.S16(i)+$s.S16(j)); break;
                    }
                }
                i = coord[0]-1; j=coord[1];
                while(i >= 0){
                    if($s.bMtx[i][j]===0){
                        moves.push($s.S16(i)+$s.S16(j)); --i;
                    }else if($s.bMtx[i][j][3] === $s.my_side){
                        break;
                    }else{
                        moves.push($s.S16(i)+$s.S16(j)); break;
                    }
                }
                i = coord[0]; j=coord[1]+1;
                while(j < $s.board_size){
                    if($s.bMtx[i][j]===0){
                        moves.push($s.S16(i)+$s.S16(j)); ++j;
                    }else if($s.bMtx[i][j][3] === $s.my_side){
                        break;
                    }else{
                        moves.push($s.S16(i)+$s.S16(j)); break;
                    }
                }
                i = coord[0]; j=coord[1]-1;
                while(j >= 0){
                    if($s.bMtx[i][j]===0) {
                        moves.push($s.S16(i)+$s.S16(j)); --j;
                    }else if($s.bMtx[i][j][3] === $s.my_side){
                        break;
                    }else {
                        moves.push($s.S16(i)+$s.S16(j)); break;
                    }
                }
                return $.grep(moves, $s.valid_sq);
            },
            'b': function (coord, side) {
                var moves = [];
                var i; var j;
                i = coord[0]+1; j = coord[1]+1;
                while(i < $s.board_size && j < $s.board_size){
                    if($s.bMtx[i][j]===0){
                        moves.push($s.S16(i)+$s.S16(j)); ++i; ++j;
                    }else if($s.bMtx[i][j][3]===$s.my_side){
                        break;
                    }else{
                        moves.push($s.S16(i)+$s.S16(j)); break;
                    }
                }
                i = coord[0]+1; j = coord[1]-1;
                while(i < $s.board_size && j >= 0){
                    if($s.bMtx[i][j]===0) {
                        moves.push($s.S16(i) + $s.S16(j)); ++i; --j;
                    }else if($s.bMtx[i][j][3]===$s.my_side){
                        break;
                    }else{
                        moves.push($s.S16(i) + $s.S16(j)); break;
                    }
                }
                i = coord[0]-1; j = coord[1]+1;
                while(i >= 0 && j < $s.board_size) {
                    if ($s.bMtx[i][j] === 0) {
                        moves.push($s.S16(i) + $s.S16(j)); --i; ++j;
                    } else if ($s.bMtx[i][j][3] === $s.my_side) {
                        break;
                    } else {
                        moves.push($s.S16(i) + $s.S16(j));
                        break;
                    }
                }
                i = coord[0]-1; j = coord[1]-1;
                while(i >= 0 && j >= 0) {
                    if ($s.bMtx[i][j] === 0) {
                        moves.push($s.S16(i) + $s.S16(j)); --i; --j;
                    }else if($s.bMtx[i][j][3] === $s.my_side){
                        break;
                    }else{
                        moves.push($s.S16(i) + $s.S16(j));
                        break;
                    }
                }
                return $.grep(moves, $s.valid_sq);
            },
            'n': function (coord, side) {
                var moves = []; var i; var j;
                i = coord[0]+1; j = coord[1]+2;
                if(i < $s.board_size && j < $s.board_size &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]-1; j = coord[1]+2;
                if(i >= 0 && j < $s.board_size &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]+1; j = coord[1]-2;
                if(i < $s.board_size && j >= 0 &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]-1; j = coord[1]-2;
                if(i >= 0 && j >= 0 &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));

                i = coord[0]+2; j = coord[1]+1;
                if(i < $s.board_size && j < $s.board_size &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]+2; j = coord[1]-1;
                if(i < $s.board_size && j >= 0 &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]-2; j = coord[1]+1;
                if(i >= 0 && j < $s.board_size &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]-2; j = coord[1]-1;
                if(i >= 0 && j >= 0 &&
                    $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));

                return $.grep(moves, $s.valid_sq);
            },
            'q': function (coord, side) {
                var moves = $s.possible_moves['r'](coord, side);
                $.merge(moves, $s.possible_moves['b'](coord, side));
                return moves;
            },
            'p': function (coord, side) {
                // TODO: add pawn attack side-wise
                // TODO: pawn can move 2 sq 1st - implement
                var moves = [];
                if(side==='T'){
                    if(coord[1]+1 < $s.board_size && $s.bMtx[coord[0]][coord[1]+1]===0) {
                        moves = [$s.S16(coord[0]) + $s.S16(coord[1]+1)];
                    }
                }
                else if(side==='L'){
                    if(coord[0]+1 < $s.board_size && $s.bMtx[coord[0]+1][coord[1]]===0){
                        moves = [$s.S16(coord[0]+1)+$s.S16(coord[1])];
                    }
                }
                else if(side==='R'){
                    if(coord[0]-1 >=0 && $s.bMtx[coord[0]-1][coord[1]]===0){
                        moves = [$s.S16(coord[0]-1)+$s.S16(coord[1])];
                    }
                }
                else if(side==='B'){
                    if(coord[1]-1 >=0 && $s.bMtx[coord[0]][coord[1]-1]===0){
                        moves = [$s.S16(coord[0])+$s.S16(coord[1]-1)];
                    }
                }
                return $.grep(moves, $s.valid_sq);

            },
            'k': function (coord, side) {
                // TODO: Add castling
                var moves = []; var i; var j;
                i = coord[0]+1; j = coord[1];
                if(i < $s.board_size && $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]-1;
                if(i >= 0 && $s.bMtx[i][j][3]!==$s.my_side)
                    moves.push($s.S16(i)+$s.S16(j));
                i = coord[0]; j = coord[1]+1;
                if(j < $s.board_size){
                    if($s.bMtx[i][j][3]!==$s.my_side)
                        moves.push($s.S16(i)+$s.S16(j));
                    if(i+1 < $s.board_size &&
                        $s.bMtx[i+1][j][3]!==$s.my_side)
                        moves.push($s.S16(i+1)+$s.S16(j));
                    if(i-1 >= 0 &&
                        $s.bMtx[i-1][j][3]!==$s.my_side)
                        moves.push($s.S16(i-1)+$s.S16(j));
                }
                j = coord[1]-1;
                if(j >= 0){
                    if($s.bMtx[i][j][3]!==$s.my_side)
                        moves.push($s.S16(i)+$s.S16(j));
                    if(i+1 < $s.board_size &&
                        $s.bMtx[i+1][j][3]!==$s.my_side)
                        moves.push($s.S16(i+1)+$s.S16(j));
                    if(i-1 >= 0 &&
                        $s.bMtx[i-1][j][3]!==$s.my_side)
                        moves.push($s.S16(i-1)+$s.S16(j));
                }
                return $.grep(moves, $s.valid_sq);
            }
        };
        $s.legal_move = function (coord) {
            /* coord: string of len 2
                      with position in 1st two chars
               Return: list of coord strings (<X>+<Y>) with valid moves possibilities
             */
            if($s.current_piece===0)
                return false;
            var piece = $s.current_piece;
            return -1 < $.inArray(coord,
                $s.get_possible_moves(piece));
        }
}]);



// $s.get_possible_moves = {
        //     /* coord: [int, int]
        //     *  side: 'T' or 'R' or 'B' or 'L'
        //     *  */
        //     'r': function (coord, side) {
        //         var moves = [];
        //         var i; var j;
        //         i = coord[0]+1; j=coord[1];
        //         while(i < $s.board_size && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); ++i;
        //         }
        //         i = coord[0]-1; j=coord[1];
        //         while(i >= 0 && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); --i;
        //         }
        //         i = coord[0]; j=coord[1]+1;
        //         while(j < $s.board_size && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); ++j;
        //         }
        //         i = coord[0]; j=coord[1]-1;
        //         while(j >= 0 && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); --j;
        //         }
        //         return moves
        //     },
        //     'b': function (coord, side) {
        //         var moves = [];
        //         var i; var j;
        //         i = coord[0]+1; j = coord[1]+1;
        //         while(i < $s.board_size && j < $s.board_size && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); ++i; ++j;
        //         }
        //         i = coord[0]+1; j = coord[1]-1;
        //         while(i < $s.board_size && j >= 0 && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); ++i; --j;
        //         }
        //         i = coord[0]-1; j = coord[1]+1;
        //         while(i >= 0 && j < $s.board_size && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); --i; ++j;
        //         }
        //         i = coord[0]-1; j = coord[1]-1;
        //         while(i >= 0 && j >= 0 && $s.bMtx[i][j]===0){
        //             moves.push([i, j]); --i; --j;
        //         }
        //         return moves;
        //     },
        //     'n': function (coord, side) {
        //         var moves = [];
        //         if(coord[0]+1 < $s.board_size && coord[1]+2 < $s.board_size)
        //             moves.push([coord[0]+1, coord[1]+2]);
        //         if(coord[0]-1 >= 0 && coord[1]+2 < $s.board_size)
        //             moves.push([coord[0]-1, coord[1]+2]);
        //         if(coord[0]+1 < $s.board_size && coord[1]-2 >= 0)
        //             moves.push([coord[0]+1, coord[1]-2]);
        //         if(coord[0]-1 >= 0 && coord[1]-2 >= 0)
        //             moves.push([coord[0]-1, coord[1]-2]);
        //         return moves;
        //     },
        //     'q': function (coord, side) {
        //         var moves = $s.get_possible_moves['r'](coord);
        //         return moves.push($s.get_possible_moves['b'](coord));
        //     },
        //     'p': function (coord, side) {
        //         // TODO: add pawn attack side-wise
        //         // TODO: pawn can move 2 sq 1st - implement
        //         if(side==='T'){
        //             if(coord[1]+1 < $s.board_size)
        //                 return [[coord[0], coord[1]+1]];
        //             return [];
        //         }
        //         if(side==='L'){
        //             if(coord[0]+1 < $s.board_size)
        //                 return [[coord[0]+1, coord[1]]];
        //             return [];
        //         }
        //         if(side==='R'){
        //             if(coord[0]-1 >=0)
        //                 return [[coord[0]-1, coord[1]]];
        //             return [];
        //         }
        //         if(side==='B'){
        //             if(coord[1]-1 >=0)
        //                 return [[coord[0], coord[1]-1]];
        //             return [];
        //         }
        //     },
        //     'k': function (coord, side) {
        //         var moves = [];
        //         if(coord[0]+1 < $s.board_size &&
        //             $s.bMtx[coord[0]+1][coord[1]]===0)
        //             moves.push([coord[0]+1, coord[1]]);
        //         if(coord[0]-1 >= 0 &&
        //             $s.bMtx[coord[0]-1][coord[1]]===0)
        //             moves.push([coord[0]-1, coord[1]]);
        //         if(coord[1]+1 < $s.board_size){
        //             if($s.bMtx[coord[0]][coord[1]+1]===0)
        //                 moves.push([coord[0], coord[1]+1]);
        //             if(coord[0]+1 < $s.board_size &&
        //                 $s.bMtx[coord[0]+1][coord[1]+1]===0)
        //                 moves.push([coord[0]+1, coord[1]+1]);
        //             if(coord[0]-1 >= 0 &&
        //                 $s.bMtx[coord[0]-1][coord[1]+1]===0)
        //                 moves.push([coord[0]-1, coord[1]+1]);
        //         }
        //         if(coord[1]-1 >= 0){
        //             if($s.bMtx[coord[0]][coord[1]-1]===0)
        //                 moves.push([coord[0], coord[1]-1]);
        //             if(coord[0]+1 < $s.board_size &&
        //                 $s.bMtx[coord[0]+1][coord[1]-1]===0)
        //                 moves.push([coord[0]+1, coord[1]-1]);
        //             if(coord[0]-1 >= 0 &&
        //                 $s.bMtx[coord[0]-1][coord[1]-1]===0)
        //                 moves.push([coord[0]-1, coord[1]-1]);
        //         }
        //         return moves;
        //     }
        // };
