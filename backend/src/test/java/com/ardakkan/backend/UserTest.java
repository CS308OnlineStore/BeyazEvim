package com.ardakkan.backend;

import com.ardakkan.backend.controller.UserController;
import com.ardakkan.backend.dto.UserDTO;
import com.ardakkan.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        // Arrange
        Long userId = 1L;
        UserDTO mockUserDTO = new UserDTO();
        mockUserDTO.setId(userId);
        mockUserDTO.setFirstName("John");
        mockUserDTO.setLastName("Doe");

        when(userService.findUserById(userId)).thenReturn(mockUserDTO);

        // Act
        ResponseEntity<UserDTO> response = userController.getUserById(userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("John", response.getBody().getFirstName());
        assertEquals("Doe", response.getBody().getLastName());
        verify(userService, times(1)).findUserById(userId);
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        // Arrange
        UserDTO user1 = new UserDTO();
        user1.setId(1L);
        user1.setFirstName("Alice");

        UserDTO user2 = new UserDTO();
        user2.setId(2L);
        user2.setFirstName("Bob");

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        // Act
        ResponseEntity<List<UserDTO>> response = userController.getAllUsers();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void updateUserAddress_ShouldUpdateAddress() {
        // Arrange
        Long userId = 1L;
        String newAddress = "123 New Street";
        UserDTO mockUserDTO = new UserDTO();
        mockUserDTO.setId(userId);
        mockUserDTO.setAddress(newAddress);

        when(userService.updateUserAddress(userId, newAddress)).thenReturn(mockUserDTO);

        // Act
        ResponseEntity<UserDTO> response = userController.updateUserAddress(userId, newAddress);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newAddress, response.getBody().getAddress());
        verify(userService, times(1)).updateUserAddress(userId, newAddress);
    }
}
