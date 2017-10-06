package org.techforumist.jwt.domain;


import javax.persistence.*;

@Entity
@Table(name = "pictures")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
}
