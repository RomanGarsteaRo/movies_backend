import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Omdb {

    @PrimaryColumn({ type: "varchar", length: 10,  }) imdbID: string;
    @Column({ type: "varchar", length: 100,  default: "N/A"  }) Title: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) Year: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) Rated: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"  }) Released: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"  }) Runtime: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Genre: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Director: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Writer: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Actors: string;
    @Column({ type: "varchar", length: 5000, default: "N/A"  }) Plot: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Language: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Country: string;
    @Column({ type: "varchar", length: 500,  default: "N/A"  }) Awards: string;
    @Column({ type: "varchar", length: 300,  default: "N/A"  }) Poster: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) Metascore: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) imdbRating: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) imdbVotes: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) RotRating: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"  }) Type: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"  }) DVD: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"  }) BoxOffice: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"  }) Production: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"  }) Response: string;
    @Column({ type: "varchar", length: 50,   default: "N/A"  }) Website: string;
}
