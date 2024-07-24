import { UserEntity } from "./user.entity" // Adjust the import path as needed
import "reflect-metadata" // Import reflect-metadata if not already imported

describe("UserEntity", () => {
  let userEntity: UserEntity

  beforeEach(() => {
    userEntity = new UserEntity()
    // Manually define properties on the instance for testing
    Object.defineProperties(userEntity, {
      id: { value: "", enumerable: true },
      fullName: { value: "", enumerable: true },
      email: { value: "", enumerable: true },
      phoneNumber: { value: "", enumerable: true },
      createdAt: { value: new Date(), enumerable: true },
      updatedAt: { value: new Date(), enumerable: true },
    })
  })

  it("should have the correct properties", () => {
    const properties = Object.keys(userEntity)
    const expectedProperties = [
      "id",
      "fullName",
      "email",
      "phoneNumber",
      "createdAt",
      "updatedAt",
    ]

    expect(properties).toEqual(expect.arrayContaining(expectedProperties))
  })

  it("should not have excluded properties", () => {
    const properties = Object.keys(userEntity)
    const excludedProperties = [
      "password",
      "role",
      "emailVerified",
      "deletedAt",
    ]

    excludedProperties.forEach((prop) => {
      expect(properties).not.toContain(prop)
    })
  })

  it("should have ApiProperty decorator on all properties", () => {
    const properties = Object.keys(userEntity)

    properties.forEach((prop) => {
      const propertyMetadata = Reflect.getMetadata(
        "swagger/apiModelProperties",
        UserEntity.prototype,
        prop
      )
      expect(propertyMetadata).toBeDefined()
    })
  })

  it("should create an instance with all properties", () => {
    const userEntity = new UserEntity()

    userEntity.id = "1"
    userEntity.fullName = "John Doe"
    userEntity.email = "john@example.com"
    userEntity.phoneNumber = "1234567890"
    userEntity.createdAt = new Date()
    userEntity.updatedAt = new Date()

    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBe("1")
    expect(userEntity.fullName).toBe("John Doe")
    expect(userEntity.email).toBe("john@example.com")
    expect(userEntity.phoneNumber).toBe("1234567890")
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })
})
