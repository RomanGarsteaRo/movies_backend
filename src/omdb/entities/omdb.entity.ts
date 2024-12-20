import { Column, Entity, PrimaryColumn } from "typeorm";


const numberTransformer = {
    to: (value: string | number) => {
        return typeof value === 'string' ? parseInt(value, 10) : value; // Dacă este string, îl transformăm în număr
    },
    from: (value: string | null) => {
        return value ? parseInt(value, 10) : null; // Dacă valoarea nu este null, o transformăm în număr
    }
};

const decimalNumberTransformer = {
    to: (value: string | number) => {
        // Dacă valoarea este un string, o transformăm într-un număr
        return typeof value === 'string' ? parseFloat(value) : value;
    },
    from: (value: string | null) => {
        // Dacă valoarea nu este null, o transformăm într-un număr
        return value ? parseFloat(value) : null;
    }
};

const arrayToStringTransformer = {
    to: (value: string[] | string) =>
        Array.isArray(value) ? value.join(", ") : value,
    from: (value: string | null) =>
        value ? value.split(", ").map((item) => item.trim()) : []
};

const percentageToNumberTransformer = {
    to: (value: number | string) =>
        typeof value === 'string' ? parseFloat(value.replace('%', '')) : value,
    from: (value: string | null) =>
        value ? parseFloat(value.replace('%', '')) : null,
};

const currencyToNumberTransformer = {
    to: (value: number | string) =>
        typeof value === 'string' ? parseFloat(value.replace(/[\$,]/g, '')) : value,
    from: (value: string | null) =>
        value ? parseFloat(value.replace(/[\$,]/g, '')) : null,
};

const votesToNumberTransformer = {
    to: (value: number | string) => {
        if (typeof value === 'string' && value.match(/^[0-9,]+$/)) {
            return parseInt(value.replace(/,/g, ''), 10);
        }
        return null;
    },
    from: (value: string | null) => {
        if (value && value.match(/^[0-9,]+$/)) {
            return parseInt(value.replace(/,/g, ''), 10);
        }
        return null;
    },
};


@Entity()
export class Omdb {

    @PrimaryColumn({ type: "varchar", length: 10,  }) imdbID: string;
    @Column({ type: "varchar", length: 100,  default: "N/A"                                             }) Title: string;
    @Column({ type: "varchar", length: 10,   default: "N/A", transformer: numberTransformer             }) Year: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"                                             }) Rated: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"                                             }) Released: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"                                             }) Runtime: string;
    @Column({ type: "varchar", length: 200,  default: "N/A", transformer: arrayToStringTransformer      }) Genre: string;
    @Column({ type: "varchar", length: 200,  default: "N/A", transformer: arrayToStringTransformer      }) Director: string;
    @Column({ type: "varchar", length: 200,  default: "N/A", transformer: arrayToStringTransformer      }) Writer: string;
    @Column({ type: "varchar", length: 200,  default: "N/A", transformer: arrayToStringTransformer      }) Actors: string;
    @Column({ type: "varchar", length: 5000, default: "N/A"                                             }) Plot: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"                                             }) Language: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"                                             }) Country: string;
    @Column({ type: "varchar", length: 500,  default: "N/A"                                             }) Awards: string;
    @Column({ type: "varchar", length: 300,  default: "N/A"                                             }) Poster: string;
    @Column({ type: "varchar", length: 10,   default: "N/A", transformer: numberTransformer             }) Metascore: string;
    @Column({ type: "varchar", length: 10,   default: "N/A", transformer: decimalNumberTransformer      }) imdbRating: string;
    @Column({ type: "varchar", length: 10,   default: "N/A", transformer: votesToNumberTransformer      }) imdbVotes: string;
    @Column({ type: "varchar", length: 10,   default: "N/A", transformer: percentageToNumberTransformer }) RotRating: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"                                             }) Type: string;
    @Column({ type: "varchar", length: 20,   default: "N/A"                                             }) DVD: string;
    @Column({ type: "varchar", length: 20,   default: "N/A", transformer: currencyToNumberTransformer   }) BoxOffice: string;
    @Column({ type: "varchar", length: 200,  default: "N/A"                                             }) Production: string;
    @Column({ type: "varchar", length: 10,   default: "N/A"                                             }) Response: string;
    @Column({ type: "varchar", length: 50,   default: "N/A"                                             }) Website: string;
}
