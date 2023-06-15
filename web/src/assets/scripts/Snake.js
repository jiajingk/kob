import { GameObject } from "./GameObject";
import { Cell } from "./Cell";

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        // store the body of a snake, cells[0] stores the head
        this.cells = [new Cell(info.r, info.c)]  
        // destination of the next step
        this.next_cell = null;
        this.speed = 3;
        // -1 means no action received, 0, 1, 2, 3 means up right down left
        this.direction = -1; 
        // "idle" means no move, "move" is moving, "die" means failed 
        this.status = "idle"; 

        this.dr = [-1, 0, 1, 0]; // displacement of row direction
        this.dc = [0, 1, 0, -1]; // displacement of column direction

        this.step = 0; // number of steps that snake passed
        this.eps = 0.01;
    } 

    set_direction(d) {
        this.direction = d
    }

    check_tail_increasing() { // check whether the length of the snake should be increased
        if (this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    start() {

    }

    next_step() { // change the status and direction of snake
        const d =  this.direction;
        this.next_cell = new Cell(
            this.cells[0].r + this.dr[d], 
            this.cells[0].c + this.dc[d], 
        );
        // reinitalize the direction as move already taken
        this.direction = -1; 
        this.status = "move";
        this.step ++ ;

        const k = this.cells.length;
        for (let i = k; i > 0; i -- ) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }
    }

    update_move() {
        
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.eps) {
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = "idle";
            if (!this.check_tail_increasing()) {
                this.cells.pop();
            }
            
        } else {
            const move_distance = this.speed * this.timedelta / 1000;
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        if (this.status === 'move') {
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 1; i < this.cells.length; i ++ ) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps ) {continue;}
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.5) * L, Math.min(a.y, b.y) * L, L, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect( Math.min(a.x, b.x) * L, (a.y - 0.5) * L, Math.abs(a.x - b.x) * L, L);
            }

        }

    }


}