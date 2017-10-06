package org.techforumist.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.techforumist.jwt.domain.Picture;

public interface PictureRepository extends JpaRepository<Picture,Long> {
}
